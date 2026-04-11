# Angular Component Patterns

## Table of Contents
1. [Dumb Component Scaffold](#dumb-component-scaffold)
2. [Smart Component Scaffold](#smart-component-scaffold)
3. [Nx Library Setup](#nx-library-setup)
4. [Signal-Based Patterns (Angular 17+)](#signal-based-patterns)
5. [Barrel Exports](#barrel-exports)
6. [Component Communication](#component-communication)

---

## Dumb Component Scaffold

A dumb (presentational) component has exactly 4 files minimum, plus optional story and test.
Never use inline templates or styles. The component is a pure function of its inputs.

### component.ts

```typescript
import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  HostBinding,
} from '@angular/core';

@Component({
  selector: 'ui-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  /** Visual variant */
  @Input() variant: 'primary' | 'secondary' | 'ghost' | 'danger' = 'primary';

  /** Size following the spacing scale */
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  /** Disabled state — also sets aria-disabled */
  @Input() disabled = false;

  /** Click event (does not fire when disabled) */
  @Output() clicked = new EventEmitter<MouseEvent>();

  @HostBinding('class') get hostClass(): string {
    return `ui-button ui-button--${this.variant} ui-button--${this.size}`;
  }

  onClick(event: MouseEvent): void {
    if (!this.disabled) {
      this.clicked.emit(event);
    }
  }
}
```

### component.html

```html
<button
  class="ui-button__native"
  [attr.aria-disabled]="disabled"
  [disabled]="disabled"
  (click)="onClick($event)"
>
  <span class="ui-button__icon" *ngIf="icon">
    <ng-content select="[buttonIcon]"></ng-content>
  </span>
  <span class="ui-button__label">
    <ng-content></ng-content>
  </span>
</button>
```

### component.scss

```scss
@use 'unigrid' as ug;

:host {
  display: inline-flex;
}

.ui-button__native {
  // Rhythm-aligned padding
  padding: var(--ug-spacing-1) var(--ug-spacing-3);
  font-family: var(--ug-font-family);
  font-size: var(--ug-font-size-base);
  line-height: var(--ug-leading);
  border: 2px solid transparent;
  border-radius: var(--ui-radius, 0);
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;

  // Minimum touch target (WCAG 2.2 Target Size)
  min-height: 44px;
  min-width: 44px;

  // Focus indicator — visible, high-contrast, never color-only
  &:focus-visible {
    outline: 3px solid var(--ui-focus-color, #1a73e8);
    outline-offset: 2px;
  }

  &:disabled,
  &[aria-disabled='true'] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

// Size variants — all rhythm-aligned
:host-context(.ui-button--sm) .ui-button__native {
  padding: var(--ug-spacing-1) var(--ug-spacing-2);
  font-size: var(--ug-font-size-sm);
  min-height: 36px;
}

:host-context(.ui-button--lg) .ui-button__native {
  padding: var(--ug-spacing-2) var(--ug-spacing-4);
  font-size: var(--ug-font-size-lg);
  min-height: 52px;
}

// Color variants
:host-context(.ui-button--primary) .ui-button__native {
  background-color: var(--ui-color-primary);
  color: var(--ui-color-on-primary);
  // Contrast: ensure 4.5:1 against background
}

:host-context(.ui-button--ghost) .ui-button__native {
  background-color: transparent;
  border-color: currentColor;
}

:host-context(.ui-button--danger) .ui-button__native {
  background-color: var(--ui-color-danger);
  color: var(--ui-color-on-danger);
}
```

### Key Rules

- `ChangeDetectionStrategy.OnPush` — always, no exceptions
- `standalone: true` — preferred for modern Angular
- `templateUrl` / `styleUrl` — never inline, never
- Inputs have defaults — component renders correctly with zero bindings
- Outputs are `EventEmitter` or signal-based outputs
- No constructor injections (no services)
- HostBinding for BEM class composition on the host element
- Accessibility attributes live in the template, not added by consumers

---

## Smart Component Scaffold

Smart components orchestrate. They're thin — mostly template glue and service calls.

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { UserListComponent } from '@my-org/ui';
import { UserService } from '../services/user.service';

@Component({
  selector: 'feature-user-dashboard',
  standalone: true,
  imports: [AsyncPipe, UserListComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss',
})
export class UserDashboardComponent implements OnInit {
  private userService = inject(UserService);

  users$ = this.userService.getUsers();
  selectedUser$ = this.userService.selectedUser$;

  onUserSelected(userId: string): void {
    this.userService.selectUser(userId);
  }

  onUserDeleted(userId: string): void {
    this.userService.deleteUser(userId);
  }
}
```

Smart component templates are often concise enough that inline could be justified — but for
consistency, keep them in separate files. This makes it easy to find any template by filename.

```html
<!-- user-dashboard.component.html -->
<div class="ug-grid">
  <div class="ug-col--md-4">
    <ui-user-list
      [users]="users$ | async"
      [selectedId]="(selectedUser$ | async)?.id"
      (userSelected)="onUserSelected($event)"
      (userDeleted)="onUserDeleted($event)"
    ></ui-user-list>
  </div>
  <div class="ug-col--md-8">
    <ui-user-detail
      [user]="selectedUser$ | async"
    ></ui-user-detail>
  </div>
</div>
```

---

## Nx Library Setup

### Creating a UI library

```bash
nx generate @nx/angular:library ui \
  --directory=libs/ui \
  --standalone \
  --changeDetection=OnPush \
  --style=scss \
  --prefix=ui
```

### Creating a feature library

```bash
nx generate @nx/angular:library feature-users \
  --directory=libs/users/feature \
  --standalone \
  --style=scss \
  --prefix=feature
```

### Recommended library structure

```
libs/
  shared/
    ui/               # Shared dumb components (buttons, inputs, cards)
    util/             # Shared utilities, pipes, directives
    data-access/      # Shared services, API clients
    models/           # Shared interfaces and types
  <domain>/
    feature/          # Smart components for this domain
    ui/               # Domain-specific dumb components
    data-access/      # Domain services and state
```

### Storybook for the UI library

```bash
nx generate @nx/storybook:configuration ui \
  --uiFramework=@storybook/angular \
  --configureCypress=false
```

---

## Signal-Based Patterns

For Angular 17+ projects, prefer signal-based APIs:

```typescript
import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';

@Component({
  selector: 'ui-badge',
  standalone: true,
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {
  /** Badge text content */
  label = input.required<string>();

  /** Visual variant */
  variant = input<'info' | 'success' | 'warning' | 'danger'>('info');

  /** Whether the badge is removable */
  removable = input(false);

  /** Emits when the remove button is clicked */
  removed = output<void>();

  /** Computed ARIA label for screen readers */
  ariaLabel = computed(() => {
    const base = this.label();
    return this.removable() ? `${base}, press Delete to remove` : base;
  });
}
```

### Detection

Check the project's `package.json` for Angular version:
- **17+**: Use `input()`, `output()`, `computed()` signals
- **16 and below**: Use `@Input()`, `@Output()` decorators

---

## Barrel Exports

Every library needs a clean public API. Export only what consumers need.

```typescript
// libs/ui/src/index.ts
export { ButtonComponent } from './lib/button/button.component';
export { InputComponent } from './lib/input/input.component';
export { CardComponent } from './lib/card/card.component';

// Types
export type { ButtonVariant, ButtonSize } from './lib/button/button.model';
```

Never export internal helpers, private components, or implementation details.

---

## Component Communication

### Parent → Child (Inputs)

Data flows down. The smart component owns the data, dumb components display it.

### Child → Parent (Outputs)

Events flow up. Dumb components emit domain events, smart components handle side effects.

### Between siblings

Never have dumb components communicate directly. Route through the smart parent:
```
SiblingA --output--> SmartParent --input--> SiblingB
```

### Cross-feature

Use a shared service with observables or signals. Never import a feature library from another
feature library — only shared libraries are cross-boundary imports.
