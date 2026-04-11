# Behavioral Economics in UI Design

## Table of Contents
1. [Progressive Disclosure](#progressive-disclosure)
2. [Default Optimization](#default-optimization)
3. [Loss Aversion & Error Prevention](#loss-aversion--error-prevention)
4. [Anchoring & Framing](#anchoring--framing)
5. [Chunking & Cognitive Load](#chunking--cognitive-load)
6. [Social Proof & Trust](#social-proof--trust)
7. [Friction Reduction](#friction-reduction)
8. [Decision Architecture](#decision-architecture)
9. [Applying Patterns to Angular Components](#applying-patterns-to-angular-components)

---

## Progressive Disclosure

**Principle**: People are overwhelmed by too many options at once. Reveal complexity
gradually, letting users drill deeper only when they need to.

**When to apply**: Any form with more than 5-7 fields, settings pages, dashboards with
multiple data views, wizard-like flows.

### Patterns

**Accordion sections for advanced options**
```html
<!-- Instead of showing 20 form fields at once -->
<ui-form-section title="Basic Information" [expanded]="true">
  <!-- 3-4 essential fields -->
</ui-form-section>
<ui-form-section title="Advanced Options" [expanded]="false">
  <!-- Additional fields, hidden by default -->
</ui-form-section>
```

**Stepped wizard for long processes**
```html
<ui-stepper [currentStep]="currentStep" [totalSteps]="4">
  <ui-step title="Account">...</ui-step>
  <ui-step title="Profile">...</ui-step>
  <ui-step title="Preferences">...</ui-step>
  <ui-step title="Review">...</ui-step>
</ui-stepper>
```

**Show more / Load more for lists**
- Display 5-10 items initially
- "Show 15 more" button (specific count, not vague "Show more")
- Progress indicator: "Showing 10 of 47"

**Tooltip/popover for contextual help**
- Keep the interface clean; offer explanations on hover/focus
- Use `aria-describedby` to link help text for screen readers

### Key rules
- Default state shows the minimum viable interface
- Expanding sections keeps the user's existing context visible
- Undo is always available — expanding/collapsing is non-destructive

---

## Default Optimization

**Principle**: People accept defaults ~70-90% of the time (Kahneman & Tversky). Smart
defaults dramatically improve completion rates and reduce decision fatigue.

### Patterns

**Pre-filled form fields**
```html
<!-- Pre-select the most common option -->
<ui-select label="Country" [value]="detectedCountry">
  <ui-option value="CH">Switzerland</ui-option>
  <!-- ... -->
</ui-select>

<!-- Pre-check recommended settings -->
<ui-checkbox [checked]="true" label="Enable notifications (recommended)">
</ui-checkbox>
```

**Smart suggestions**
- Date pickers default to today or the most likely date (e.g., next business day)
- Quantity fields default to 1 (not empty)
- Currency fields default to the user's locale currency
- Address forms pre-fill from browser autofill or saved profiles

**"Recommended" badges**
```html
<ui-card [highlighted]="true">
  <ui-badge variant="success">Recommended</ui-badge>
  <h3>Standard Plan</h3>
  <!-- Default selection stands out visually -->
</ui-card>
```

### Key rules
- Defaults should genuinely serve the user's interest, not business metrics
- Make it obvious something is pre-selected (visual differentiation)
- Always allow the user to change the default easily

---

## Loss Aversion & Error Prevention

**Principle**: People feel losses ~2× more strongly than equivalent gains (Kahneman, 1979).
Use this to prevent errors, not to manipulate. Destructive actions should feel heavy.

### Patterns

**Graduated warning for destructive actions**
```html
<!-- Level 1: Subtle danger button -->
<ui-button variant="danger" (clicked)="confirmDelete()">
  Delete Account
</ui-button>

<!-- Level 2: Confirmation dialog with consequences -->
<ui-dialog title="Delete your account?">
  <p>This will permanently remove:</p>
  <ul>
    <li>47 saved projects</li>
    <li>1,203 files</li>
    <li>All collaboration invites</li>
  </ul>
  <p><strong>This cannot be undone.</strong></p>
  <ui-button variant="ghost" (clicked)="cancel()">Keep Account</ui-button>
  <ui-button variant="danger" (clicked)="delete()">Delete Everything</ui-button>
</ui-dialog>
```

**Undo instead of confirm**
```html
<!-- Better than "Are you sure?": let them undo -->
<ui-toast variant="warning" [duration]="8000">
  Item moved to trash.
  <ui-button variant="ghost" size="sm" (clicked)="undo()">Undo</ui-button>
</ui-toast>
```

**Inline validation (prevent errors before they happen)**
```html
<ui-input
  label="Email"
  type="email"
  [validators]="emailValidators"
  errorMessage="Please enter a valid email address"
  successMessage="Looks good!"
>
</ui-input>
```

### Key rules
- Quantify what will be lost ("47 projects" not "your data")
- Make the safe option visually prominent (larger, primary color)
- Make the destructive option visually subdued (ghost/outline style)
- Offer undo when possible — it's less interruptive than confirmation dialogs
- Inline validation > post-submit validation (prevent errors at the source)

---

## Anchoring & Framing

**Principle**: The first piece of information people see becomes a reference point for all
subsequent judgments. Frame choices to guide (not deceive) users toward good decisions.

### Patterns

**Pricing comparison with anchor**
```html
<div class="ug-grid">
  <ui-pricing-card
    title="Basic"
    price="9"
    [features]="basicFeatures"
  ></ui-pricing-card>

  <!-- Anchor: this is the reference point -->
  <ui-pricing-card
    title="Professional"
    price="29"
    [features]="proFeatures"
    [highlighted]="true"
    badge="Most Popular"
  ></ui-pricing-card>

  <ui-pricing-card
    title="Enterprise"
    price="99"
    [features]="enterpriseFeatures"
  ></ui-pricing-card>
</div>
```

**Positive framing**
```
// Instead of: "You have 3 errors"
// Use: "Almost there — 3 fields need attention"

// Instead of: "Failed to save"
// Use: "Changes not saved yet — try again"

// Instead of: "Your password is weak"
// Use: "Add a number or symbol to strengthen your password"
```

**Progress anchoring**
```html
<!-- Show progress to motivate completion -->
<ui-progress [value]="65" label="Profile 65% complete">
  <span>Add your photo to reach 80%</span>
</ui-progress>
```

### Key rules
- Place the recommended option in the center (or second position in a row of three)
- Use "Most Popular" or "Recommended" labels to anchor attention
- Frame messages positively — focus on what the user gains or what's left to do
- Show progress as a percentage (anchors the user to completion)

---

## Chunking & Cognitive Load

**Principle**: Working memory holds 4±1 items (Cowan, 2001). Group related elements into
chunks of 3-5 to reduce cognitive load.

### Patterns

**Form field grouping**
```html
<!-- Bad: 15 fields in a flat list -->
<!-- Good: 3 groups of 5 fields -->
<ui-form-group title="Personal Details">
  <ui-input label="First Name"></ui-input>
  <ui-input label="Last Name"></ui-input>
  <ui-input label="Date of Birth" type="date"></ui-input>
</ui-form-group>

<ui-form-group title="Contact Information">
  <ui-input label="Email" type="email"></ui-input>
  <ui-input label="Phone" type="tel"></ui-input>
</ui-form-group>

<ui-form-group title="Address">
  <ui-input label="Street"></ui-input>
  <ui-input label="City"></ui-input>
  <ui-input label="Postal Code"></ui-input>
</ui-form-group>
```

**Navigation chunking**
- Maximum 5-7 top-level navigation items
- Group secondary items under dropdowns
- Use visual separators between groups

**Dashboard card grouping**
- Group related KPIs into a single card (3-4 metrics per card)
- Separate card groups with spacing-5 (2× leading)
- Within a group, use spacing-3 (1× leading)

### Key rules
- 3-5 items per group (not more)
- Use visual separators: whitespace, borders, or background color
- Label each group clearly
- Related fields are adjacent, not scattered

---

## Social Proof & Trust

**Principle**: People look to others' behavior to guide their own decisions, especially
under uncertainty (Cialdini, 2001).

### Patterns

**Usage indicators**
```html
<ui-select label="Template">
  <ui-option value="standard">Standard Report ★ Used by 83% of teams</ui-option>
  <ui-option value="detailed">Detailed Report</ui-option>
  <ui-option value="executive">Executive Summary</ui-option>
</ui-select>
```

**Trust signals on forms**
```html
<ui-form>
  <!-- ... form fields ... -->
  <footer class="form-trust">
    <ui-icon name="lock"></ui-icon>
    <span>Your data is encrypted and never shared</span>
  </footer>
</ui-form>
```

**Activity indicators**
```html
<ui-avatar-stack [users]="activeUsers" [max]="3">
  <span>and 12 others are viewing</span>
</ui-avatar-stack>
```

### Key rules
- Use real numbers when possible ("83% of teams" not "most teams")
- Place trust signals near anxiety-inducing elements (payment forms, data requests)
- Don't fabricate social proof — it erodes trust when discovered

---

## Friction Reduction

**Principle**: Every additional step, field, or click in a process increases abandonment.
Remove unnecessary friction while preserving intentional friction for destructive actions.

### Patterns

**Minimize required fields**
- Mark optional fields as "(optional)" instead of marking required fields with asterisks
- This frames most fields as expected, reducing the feeling of burden
- The 80/20 rule: if 80% of users fill in a field, make it required. If not, make it optional.

**Inline actions**
```html
<!-- Edit in place instead of navigating to a form -->
<ui-editable-text
  [value]="item.name"
  (saved)="updateName($event)"
></ui-editable-text>
```

**Autosave**
```html
<!-- Save draft automatically, show status -->
<ui-save-indicator [status]="saveStatus">
  <!-- Shows: "Saved" / "Saving..." / "Unsaved changes" -->
</ui-save-indicator>
```

**Smart input types**
```html
<!-- Use appropriate input types for mobile keyboards -->
<ui-input type="email" inputmode="email"></ui-input>
<ui-input type="tel" inputmode="tel"></ui-input>
<ui-input type="number" inputmode="decimal"></ui-input>
```

### Key rules
- Count clicks/taps for common tasks — reduce where possible
- Use `inputmode` to show the right keyboard on mobile
- Automate what can be automated (autosave, autofill, auto-detect)
- Reserve friction for moments when slowing down prevents errors

---

## Decision Architecture

**Principle**: How choices are presented shapes which choice people make. Design the
choice architecture to guide users toward outcomes that serve them.

### Patterns

**Limited choice sets**
```html
<!-- Instead of a dropdown with 50 options, use a filtered search -->
<ui-combobox
  label="Select department"
  [options]="departments"
  [searchable]="true"
  placeholder="Search or select..."
></ui-combobox>
```

**Comparison tables for complex decisions**
```html
<ui-comparison-table
  [items]="plans"
  [features]="featureList"
  [recommended]="'professional'"
></ui-comparison-table>
```

**Binary simplification**
```html
<!-- Instead of complex radio groups for simple yes/no -->
<ui-toggle
  label="Enable dark mode"
  [checked]="darkMode"
  (changed)="toggleDarkMode($event)"
></ui-toggle>
```

---

## Applying Patterns to Angular Components

When building any component, ask these questions:

1. **Does this show too much at once?** → Progressive disclosure
2. **Can I pre-fill or pre-select something?** → Default optimization
3. **Can the user lose data or make irreversible mistakes?** → Loss aversion
4. **Is there a recommended option?** → Anchoring
5. **Are there more than 5 related items?** → Chunking
6. **Is the user making a trust decision?** → Social proof
7. **How many steps does the common path take?** → Friction reduction
8. **Are there too many choices?** → Decision architecture

Encode these as a checklist in the component's story description, so reviewers can
verify behavioral patterns were considered during development.
