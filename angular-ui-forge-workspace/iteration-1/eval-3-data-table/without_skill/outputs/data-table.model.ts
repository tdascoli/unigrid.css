// ==========================================================================
// DataTable — Models & Interfaces
//
// Pure type definitions for the data-table component.
// No runtime logic — consumed by the component and stories.
// ==========================================================================

/** Sort direction for a column. */
export type SortDirection = 'asc' | 'desc' | null;

/** Current sort state. */
export interface SortState {
  /** Column key currently sorted by. */
  column: string;
  /** Sort direction. */
  direction: SortDirection;
}

/** Column definition describing a single table column. */
export interface ColumnDef<T = any> {
  /** Unique key — used for data access (`row[key]`) and sort tracking. */
  key: string;
  /** Display header label. */
  label: string;
  /** Whether this column is sortable. Default: false. */
  sortable?: boolean;
  /** Whether this column is visible. Default: true. */
  visible?: boolean;
  /** Optional CSS width (e.g. '120px', '20%'). */
  width?: string;
  /** Column alignment. Default: 'left'. */
  align?: 'left' | 'center' | 'right';
  /** Optional custom cell render function (returns raw string). */
  format?: (value: any, row: T) => string;
  /** Whether the column is shown as a label on mobile cards. Default: false (first two columns auto-shown). */
  cardLabel?: boolean;
}

/** Filter state for a single column text filter. */
export interface FilterState {
  /** Column key to filter on. */
  column: string;
  /** Filter value (case-insensitive substring match). */
  value: string;
}

/** Pagination state. */
export interface PaginationState {
  /** Current page (1-based). */
  page: number;
  /** Rows per page. */
  pageSize: number;
  /** Total number of rows after filtering. */
  totalRows: number;
  /** Total number of pages. */
  totalPages: number;
}

/** Page sizes available in the dropdown. */
export const DEFAULT_PAGE_SIZES = [10, 25, 50, 100] as const;

/** Emitted when the table state changes. */
export interface DataTableState<T = any> {
  sort: SortState | null;
  filters: FilterState[];
  pagination: PaginationState;
  selectedRows: T[];
}

/** Responsive breakpoint for card/table switch (matches unigrid "md" = 768px). */
export const CARD_BREAKPOINT = 768;
