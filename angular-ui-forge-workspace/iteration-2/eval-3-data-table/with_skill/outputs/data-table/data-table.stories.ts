import type { Meta, StoryObj } from '@storybook/angular';
import { DataTableComponent } from './data-table.component';
import {
  ColumnDef,
  FilterChip,
  PaginationState,
  SortState,
} from './data-table.model';

// ================================================================
// Sample data
// ================================================================

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
}

const SAMPLE_USERS: User[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active', lastActive: '2 hours ago' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Active', lastActive: '5 hours ago' },
  { id: 3, name: 'Carol Davis', email: 'carol@example.com', role: 'Viewer', status: 'Inactive', lastActive: '3 days ago' },
  { id: 4, name: 'Dan Wilson', email: 'dan@example.com', role: 'Editor', status: 'Pending', lastActive: '1 week ago' },
  { id: 5, name: 'Eve Martinez', email: 'eve@example.com', role: 'Admin', status: 'Active', lastActive: 'Just now' },
  { id: 6, name: 'Frank Lee', email: 'frank@example.com', role: 'Viewer', status: 'Active', lastActive: '1 hour ago' },
  { id: 7, name: 'Grace Kim', email: 'grace@example.com', role: 'Editor', status: 'Inactive', lastActive: '2 weeks ago' },
  { id: 8, name: 'Henry Brown', email: 'henry@example.com', role: 'Viewer', status: 'Active', lastActive: '30 minutes ago' },
];

const COLUMNS: ColumnDef<User>[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'status', label: 'Status', sortable: true, type: 'status' },
  { key: 'lastActive', label: 'Last Active', sortable: true, type: 'date' },
  { key: 'actions', label: 'Actions', sortable: false, type: 'actions', visibleOnMobile: false },
];

const DEFAULT_PAGINATION: PaginationState = {
  currentPage: 1,
  pageSize: 10,
  totalItems: 47,
};

const DEFAULT_SORT: SortState = {
  column: 'name',
  direction: 'asc',
};

const SAMPLE_FILTERS: FilterChip[] = [
  { id: 'f1', column: 'status', label: 'Status: Active', value: 'Active' },
  { id: 'f2', column: 'role', label: 'Role: Admin', value: 'Admin' },
];

// ================================================================
// Meta
// ================================================================

const meta: Meta<DataTableComponent<User>> = {
  title: 'Components/DataTable',
  component: DataTableComponent,
  tags: ['autodocs'],
  argTypes: {
    columns: { control: 'object', description: 'Column definitions' },
    data: { control: 'object', description: 'Row data array' },
    sort: { control: 'object', description: 'Current sort state' },
    filters: { control: 'object', description: 'Active filter chips' },
    pagination: { control: 'object', description: 'Pagination state' },
    loading: { control: 'boolean', description: 'Loading state' },
    selectable: { control: 'boolean', description: 'Enable row selection' },
    searchQuery: { control: 'text', description: 'Search input value' },
    searchPlaceholder: { control: 'text', description: 'Search placeholder' },
    tableLabel: { control: 'text', description: 'Accessible table label' },
    emptyTitle: { control: 'text', description: 'Empty state title' },
    emptyText: { control: 'text', description: 'Empty state description' },
    showSearch: { control: 'boolean', description: 'Show search input' },
    showFilterButton: { control: 'boolean', description: 'Show filter toggle' },
    sortChange: { action: 'sortChange' },
    pageChange: { action: 'pageChange' },
    selectionChange: { action: 'selectionChange' },
    rowAction: { action: 'rowAction' },
    searchChange: { action: 'searchChange' },
    filterToggle: { action: 'filterToggle' },
    filterRemove: { action: 'filterRemove' },
    filtersClear: { action: 'filtersClear' },
  },
  parameters: {
    docs: {
      description: {
        component: `
## DataTable

A responsive, accessible data table component for dashboard use.

### Features
- **Sorting**: Click column headers to sort ascending/descending
- **Filtering**: Filter chips with clear-all action
- **Pagination**: Page navigation with configurable page sizes
- **Row Selection**: Checkbox-based multi-select with bulk actions
- **Responsive**: Card layout on mobile, table on desktop

### Behavioral Economics
- **Progressive Disclosure**: Filters are hidden by default, revealed on demand
- **Smart Defaults**: Page size defaults to 10 (most common), first page selected
- **Loss Aversion**: Delete actions use danger styling and require confirmation
- **Friction Reduction**: Search has debounced input, pagination preserves context

### Accessibility
- All interactive elements meet 44x44px minimum touch target
- Focus indicators use outline (forced-colors safe)
- Sort state announced via aria-sort
- Loading state uses aria-busy and role="status"
- Empty state uses role="status" for screen reader announcement
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<DataTableComponent<User>>;

// ================================================================
// Stories
// ================================================================

/**
 * Default state: table with data, sorting enabled, no active filters.
 */
export const Default: Story = {
  args: {
    columns: COLUMNS,
    data: SAMPLE_USERS,
    sort: DEFAULT_SORT,
    filters: [],
    pagination: DEFAULT_PAGINATION,
    selectedIds: new Set(),
    loading: false,
    selectable: true,
    searchQuery: '',
    searchPlaceholder: 'Search users...',
    tableLabel: 'Users',
    showSearch: true,
    showFilterButton: true,
  },
};

/**
 * Empty state: no data matches the current query/filters.
 */
export const Empty: Story = {
  args: {
    ...Default.args,
    data: [],
    searchQuery: 'zzzzxxx',
    pagination: { currentPage: 1, pageSize: 10, totalItems: 0 },
    emptyTitle: 'No results found',
    emptyText: 'Try adjusting your search or filter criteria to find what you are looking for.',
  },
};

/**
 * Loading state: skeleton rows while data is being fetched.
 */
export const Loading: Story = {
  args: {
    ...Default.args,
    data: [],
    loading: true,
    skeletonRows: 5,
  },
};

/**
 * With active filters and selected rows: demonstrates filter chips,
 * bulk action area, and selected row highlighting.
 */
export const WithFilters: Story = {
  args: {
    ...Default.args,
    filters: SAMPLE_FILTERS,
    searchQuery: 'alice',
    data: [SAMPLE_USERS[0], SAMPLE_USERS[4]],
    selectedIds: new Set([1, 5]),
    pagination: { currentPage: 1, pageSize: 10, totalItems: 2 },
  },
};

/**
 * Mobile view: simulates a narrow viewport to show the card-based layout.
 * Resize the Storybook viewport to < 768px to see the cards.
 */
export const MobileView: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story:
          'On screens narrower than 768px, the table switches to a card-based layout. Each row becomes a card with labeled fields. Resize the viewport or use the viewport addon to see this behavior.',
      },
    },
  },
};

/**
 * Keyboard navigation: demonstrates focus behavior.
 * Tab through sort buttons, checkboxes, pagination, and action buttons.
 */
export const KeyboardNavigation: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Tab to navigate between sort buttons (44px touch target), checkboxes (44px wrapper), pagination buttons (44px), and row action buttons (44px). Focus ring is a 3px blue outline, visible in high contrast mode.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    // Focus the first sort button to demonstrate the focus ring
    const firstSortBtn = canvasElement.querySelector('.data-table__sort-btn') as HTMLElement;
    firstSortBtn?.focus();
  },
};

/**
 * All sizes comparison: shows pagination with many pages.
 */
export const ManyPages: Story = {
  args: {
    ...Default.args,
    pagination: { currentPage: 3, pageSize: 5, totalItems: 247 },
  },
};

/**
 * No selection: table without checkbox column.
 */
export const NonSelectable: Story = {
  args: {
    ...Default.args,
    selectable: false,
  },
};
