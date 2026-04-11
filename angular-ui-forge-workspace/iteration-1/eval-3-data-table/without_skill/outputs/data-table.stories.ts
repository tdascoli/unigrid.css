import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { DataTableComponent } from './data-table.component';
import { ColumnDef } from './data-table.model';

// ==========================================================================
// Sample data for stories
// ==========================================================================

interface Employee {
  id: number;
  name: string;
  department: string;
  role: string;
  email: string;
  salary: number;
  startDate: string;
  status: string;
}

const SAMPLE_COLUMNS: ColumnDef<Employee>[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'department', label: 'Department', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'email', label: 'Email', sortable: false, width: '220px' },
  {
    key: 'salary',
    label: 'Salary',
    sortable: true,
    align: 'right',
    format: (val: number) => '$' + val.toLocaleString(),
  },
  { key: 'startDate', label: 'Start Date', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
];

function generateEmployees(count: number): Employee[] {
  const departments = ['Engineering', 'Design', 'Marketing', 'Sales', 'Operations', 'Finance', 'HR'];
  const roles = [
    'Manager', 'Senior Engineer', 'Designer', 'Analyst', 'Coordinator',
    'Lead', 'Director', 'Specialist', 'Intern', 'VP',
  ];
  const statuses = ['Active', 'On Leave', 'Contractor', 'Probation'];
  const firstNames = [
    'Alice', 'Bob', 'Carlos', 'Diana', 'Eli', 'Fiona', 'George', 'Hannah',
    'Ivan', 'Julia', 'Ken', 'Laura', 'Marco', 'Nina', 'Oscar', 'Priya',
    'Quinn', 'Rosa', 'Sam', 'Tina', 'Uri', 'Vera', 'Will', 'Xena', 'Yuki', 'Zara',
  ];
  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
    'Davis', 'Rodriguez', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Moore',
  ];

  return Array.from({ length: count }, (_, i) => {
    const first = firstNames[i % firstNames.length];
    const last = lastNames[i % lastNames.length];
    const dept = departments[i % departments.length];
    const role = roles[i % roles.length];
    const year = 2018 + (i % 7);
    const month = String((i % 12) + 1).padStart(2, '0');
    return {
      id: i + 1,
      name: `${first} ${last}`,
      department: dept,
      role: role,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`,
      salary: 55000 + Math.floor(i * 3200) + (i % 5) * 1000,
      startDate: `${year}-${month}-15`,
      status: statuses[i % statuses.length],
    };
  });
}

const SAMPLE_DATA = generateEmployees(47);

// ==========================================================================
// Meta
// ==========================================================================

const meta: Meta<DataTableComponent<Employee>> = {
  title: 'Components/DataTable',
  component: DataTableComponent,
  decorators: [
    moduleMetadata({
      imports: [FormsModule],
    }),
  ],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    filterable: { control: 'boolean' },
    selectable: { control: 'boolean' },
    sortable: { control: 'boolean' },
    paginated: { control: 'boolean' },
    striped: { control: 'boolean' },
    loading: { control: 'boolean' },
    pageSize: { control: { type: 'select' }, options: [10, 25, 50, 100] },
    emptyMessage: { control: 'text' },
    caption: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<DataTableComponent<Employee>>;

// ==========================================================================
// Stories
// ==========================================================================

/** Default table with all features enabled. */
export const Default: Story = {
  args: {
    columns: SAMPLE_COLUMNS,
    data: SAMPLE_DATA,
    filterable: true,
    selectable: true,
    sortable: true,
    paginated: true,
    striped: true,
    pageSize: 10,
    caption: 'Employee Directory',
    trackByField: 'id',
  },
};

/** Read-only table without selection or filtering. */
export const ReadOnly: Story = {
  args: {
    columns: SAMPLE_COLUMNS,
    data: SAMPLE_DATA,
    filterable: false,
    selectable: false,
    sortable: true,
    paginated: true,
    striped: true,
    pageSize: 10,
    caption: 'Employee Directory (Read Only)',
    trackByField: 'id',
  },
};

/** Minimal table: no sort, no filter, no select, no pagination. */
export const Minimal: Story = {
  args: {
    columns: SAMPLE_COLUMNS.map((c) => ({ ...c, sortable: false })),
    data: SAMPLE_DATA.slice(0, 5),
    filterable: false,
    selectable: false,
    sortable: false,
    paginated: false,
    striped: false,
    caption: 'Minimal Table',
    trackByField: 'id',
  },
};

/** Loading state with spinner. */
export const Loading: Story = {
  args: {
    columns: SAMPLE_COLUMNS,
    data: [],
    loading: true,
    filterable: true,
    selectable: true,
    sortable: true,
    paginated: true,
    caption: 'Loading...',
    trackByField: 'id',
  },
};

/** Empty state when no data matches. */
export const Empty: Story = {
  args: {
    columns: SAMPLE_COLUMNS,
    data: [],
    loading: false,
    filterable: true,
    selectable: false,
    sortable: true,
    paginated: true,
    emptyMessage: 'No employees found matching your criteria.',
    caption: 'Employee Directory',
    trackByField: 'id',
  },
};

/** Large dataset (200 rows) to test pagination. */
export const LargeDataset: Story = {
  args: {
    columns: SAMPLE_COLUMNS,
    data: generateEmployees(200),
    filterable: true,
    selectable: true,
    sortable: true,
    paginated: true,
    pageSize: 25,
    caption: 'Large Employee Directory',
    trackByField: 'id',
  },
};

/** Few columns for compact display. */
export const FewColumns: Story = {
  args: {
    columns: SAMPLE_COLUMNS.slice(0, 3),
    data: SAMPLE_DATA,
    filterable: true,
    selectable: true,
    sortable: true,
    paginated: true,
    pageSize: 10,
    caption: 'Compact View',
    trackByField: 'id',
  },
};

/** Custom formatted columns with right-aligned salary. */
export const CustomFormatting: Story = {
  args: {
    columns: [
      { key: 'name', label: 'Full Name', sortable: true },
      { key: 'department', label: 'Dept.', sortable: true, width: '120px' },
      {
        key: 'salary',
        label: 'Annual Salary',
        sortable: true,
        align: 'right' as const,
        format: (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val),
      },
      {
        key: 'status',
        label: 'Status',
        sortable: true,
        format: (val: string) => val.toUpperCase(),
      },
    ],
    data: SAMPLE_DATA,
    filterable: true,
    selectable: false,
    sortable: true,
    paginated: true,
    pageSize: 10,
    striped: true,
    caption: 'Custom Formatting',
    trackByField: 'id',
  },
};
