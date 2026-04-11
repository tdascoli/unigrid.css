import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DataTableComponent } from './data-table.component';
import { ColumnDef, PaginationState, SortState } from './data-table.model';

// ── Sample data ─────────────────────────────────────────────────────

const SAMPLE_COLUMNS: ColumnDef[] = [
  { key: 'id', label: 'ID', width: '60px', align: 'center', type: 'number' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role', width: '120px' },
  { key: 'department', label: 'Department', width: '140px' },
  { key: 'status', label: 'Status', width: '100px', align: 'center' },
  { key: 'salary', label: 'Salary', align: 'right', type: 'number',
    format: (v: number) => v ? `$${v.toLocaleString()}` : '' },
];

function generateRows(count: number): any[] {
  const names = ['Alice Martin', 'Bob Chen', 'Carol Davis', 'David Kim', 'Eve Wilson',
    'Frank Lopez', 'Grace Taylor', 'Henry Brown', 'Iris White', 'Jack Anderson',
    'Karen Lee', 'Leo Harris', 'Mona Clark', 'Nick Young', 'Olivia Scott'];
  const roles = ['Engineer', 'Designer', 'Manager', 'Analyst', 'Lead'];
  const departments = ['Engineering', 'Design', 'Product', 'Marketing', 'Sales'];
  const statuses = ['Active', 'On Leave', 'Remote'];
  const domains = ['example.com', 'corp.io', 'work.org'];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: names[i % names.length],
    email: `${names[i % names.length].toLowerCase().replace(' ', '.')}@${domains[i % domains.length]}`,
    role: roles[i % roles.length],
    department: departments[i % departments.length],
    status: statuses[i % statuses.length],
    salary: 50000 + Math.floor(i * 3200),
  }));
}

const SAMPLE_ROWS = generateRows(47);

const DEFAULT_PAGINATION: PaginationState = {
  pageIndex: 0,
  pageSize: 10,
  totalItems: 47,
};

const DEFAULT_SORT: SortState = { column: '', direction: null };

// ── Meta ────────────────────────────────────────────────────────────

const meta: Meta<DataTableComponent> = {
  title: 'Components/DataTable',
  component: DataTableComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [CommonModule, FormsModule],
    }),
  ],
  argTypes: {
    columns: { control: 'object', description: 'Column definitions' },
    rows: { control: 'object', description: 'Visible row data (current page)' },
    sort: { control: 'object', description: 'Current sort state' },
    searchTerm: { control: 'text', description: 'Current search/filter term' },
    pagination: { control: 'object', description: 'Pagination state' },
    selectable: { control: 'boolean', description: 'Enable row selection' },
    loading: { control: 'boolean', description: 'Show loading skeleton' },
    emptyMessage: { control: 'text', description: 'Message when no rows' },
    caption: { control: 'text', description: 'Optional table caption' },
    sortChanged: { action: 'sortChanged' },
    filterChanged: { action: 'filterChanged' },
    pageChanged: { action: 'pageChanged' },
    selectionChanged: { action: 'selectionChanged' },
  },
  parameters: {
    docs: {
      description: {
        component: `
A responsive data table supporting sorting, filtering, pagination, and row selection.
Displays as a **table on desktop** and **cards on mobile**.

**Behavioral Economics applied:**
- **Progressive Disclosure**: filter bar reveals results incrementally
- **Default Optimization**: sensible page size (10), sort indicators guide next action
- **Chunking**: pagination breaks large datasets into digestible pages
- **Friction Reduction**: instant search filtering, clear button on search

**Accessibility (WCAG 2.2 AA):**
- Proper \`<table>\` semantics with \`aria-sort\` on sortable columns
- Checkbox labels for screen readers
- Focus indicators (3px high-contrast outline)
- Touch targets >= 44px
- Reduced motion respected
- High contrast mode supported
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<DataTableComponent>;

// ── Stories ─────────────────────────────────────────────────────────

/** Default table with data, sorting, pagination */
export const Default: Story = {
  args: {
    columns: SAMPLE_COLUMNS,
    rows: SAMPLE_ROWS.slice(0, 10),
    sort: DEFAULT_SORT,
    searchTerm: '',
    pagination: DEFAULT_PAGINATION,
    selectable: false,
    loading: false,
    caption: 'Employee Directory',
  },
};

/** Table with row selection enabled */
export const WithSelection: Story = {
  args: {
    ...Default.args,
    selectable: true,
    selectedIds: [2, 5],
  },
};

/** All rows selected */
export const AllSelected: Story = {
  args: {
    ...Default.args,
    selectable: true,
    selectedIds: SAMPLE_ROWS.slice(0, 10).map((r) => r.id),
    allSelected: true,
  },
};

/** Sorted ascending by name */
export const SortedAscending: Story = {
  args: {
    ...Default.args,
    sort: { column: 'name', direction: 'asc' as const },
    rows: [...SAMPLE_ROWS.slice(0, 10)].sort((a, b) => a.name.localeCompare(b.name)),
  },
};

/** Sorted descending by salary */
export const SortedDescending: Story = {
  args: {
    ...Default.args,
    sort: { column: 'salary', direction: 'desc' as const },
    rows: [...SAMPLE_ROWS.slice(0, 10)].sort((a, b) => b.salary - a.salary),
  },
};

/** With a search/filter term active */
export const WithFilter: Story = {
  args: {
    ...Default.args,
    searchTerm: 'engineer',
    rows: SAMPLE_ROWS.filter((r) => r.role === 'Engineer').slice(0, 10),
    pagination: { pageIndex: 0, pageSize: 10, totalItems: 10 },
  },
};

/** Empty state — no data matches */
export const Empty: Story = {
  args: {
    ...Default.args,
    rows: [],
    searchTerm: 'zzzzz',
    pagination: { pageIndex: 0, pageSize: 10, totalItems: 0 },
    emptyMessage: 'No employees match your search.',
  },
};

/** Loading skeleton */
export const Loading: Story = {
  args: {
    ...Default.args,
    loading: true,
    rows: [],
  },
};

/** Page 3 of paginated results */
export const PaginatedPage3: Story = {
  args: {
    ...Default.args,
    pagination: { pageIndex: 2, pageSize: 10, totalItems: 47 },
    rows: SAMPLE_ROWS.slice(20, 30),
  },
};

/** Small page size (5 rows) */
export const SmallPageSize: Story = {
  args: {
    ...Default.args,
    pagination: { pageIndex: 0, pageSize: 5, totalItems: 47 },
    rows: SAMPLE_ROWS.slice(0, 5),
    pageSizeOptions: [5, 10, 25],
  },
};

/** Large dataset showing last page */
export const LastPage: Story = {
  args: {
    ...Default.args,
    pagination: { pageIndex: 4, pageSize: 10, totalItems: 47 },
    rows: SAMPLE_ROWS.slice(40, 47),
  },
};

/** Minimal columns — fewer fields for simpler use cases */
export const MinimalColumns: Story = {
  args: {
    ...Default.args,
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'status', label: 'Status', align: 'center' as const },
    ],
    caption: 'Simple Contact List',
  },
};

/** Mobile viewport — card layout */
export const MobileCardView: Story = {
  args: { ...Default.args, selectable: true },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    docs: {
      description: {
        story: 'On screens below 768px, the table switches to a stacked card layout for each row.',
      },
    },
  },
};

/** Tablet viewport */
export const TabletView: Story = {
  args: { ...Default.args, selectable: true },
  parameters: {
    viewport: { defaultViewport: 'tablet' },
  },
};

/** Desktop wide viewport */
export const DesktopView: Story = {
  args: { ...Default.args, selectable: true },
  parameters: {
    viewport: { defaultViewport: 'responsive' },
  },
};

/** Keyboard navigation — demonstrates focus behavior */
export const KeyboardNavigation: Story = {
  args: { ...Default.args },
  parameters: {
    docs: {
      description: {
        story: `
Tab through interactive elements: search input, sort buttons, checkboxes,
pagination controls. All have visible 3px focus rings. Sort toggles through
asc -> desc -> none on repeated activation.
        `,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const searchInput = canvasElement.querySelector<HTMLInputElement>('.ui-data-table__search-input');
    searchInput?.focus();
  },
};

/** All variants — visual comparison grid */
export const AllStates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 3rem;">
        <div>
          <h3 style="margin: 0 0 1rem; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.04em; color: #666;">
            With Data (default)
          </h3>
          <ui-data-table
            [columns]="columns"
            [rows]="rows"
            [sort]="defaultSort"
            [pagination]="defaultPagination"
            caption="Employee Directory"
          ></ui-data-table>
        </div>

        <div>
          <h3 style="margin: 0 0 1rem; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.04em; color: #666;">
            Loading State
          </h3>
          <ui-data-table
            [columns]="columns"
            [rows]="[]"
            [loading]="true"
            [sort]="defaultSort"
            [pagination]="defaultPagination"
          ></ui-data-table>
        </div>

        <div>
          <h3 style="margin: 0 0 1rem; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.04em; color: #666;">
            Empty State
          </h3>
          <ui-data-table
            [columns]="columns"
            [rows]="[]"
            [sort]="defaultSort"
            [pagination]="emptyPagination"
            searchTerm="nonexistent"
            emptyMessage="No employees match your search."
          ></ui-data-table>
        </div>
      </div>
    `,
    props: {
      columns: SAMPLE_COLUMNS,
      rows: SAMPLE_ROWS.slice(0, 5),
      defaultSort: DEFAULT_SORT,
      defaultPagination: { pageIndex: 0, pageSize: 5, totalItems: 47 },
      emptyPagination: { pageIndex: 0, pageSize: 10, totalItems: 0 },
    },
  }),
};
