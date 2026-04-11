/**
 * Data Table — Models & Types
 *
 * Shared interfaces for the dumb DataTableComponent and
 * its smart container. Designed for generic, type-safe usage.
 */

/** Sort direction for column headers */
export type SortDirection = 'asc' | 'desc' | null;

/** Describes a sortable/filterable column */
export interface ColumnDef<T = any> {
  /** Unique key matching a property on the row data object */
  key: string;

  /** Human-readable header label */
  label: string;

  /** Whether the column is sortable (default: true) */
  sortable?: boolean;

  /** Whether the column is visible on mobile card view (default: true) */
  visibleOnMobile?: boolean;

  /** Optional CSS width hint (e.g. '120px', '20%') */
  width?: string;

  /** Alignment: 'left' | 'center' | 'right' (default: 'left') */
  align?: 'left' | 'center' | 'right';

  /** Optional custom cell render type hint */
  type?: 'text' | 'number' | 'date' | 'badge' | 'actions';

  /** Optional formatter — receives cell value + full row, returns display string */
  format?: (value: any, row: T) => string;
}

/** Current sort state */
export interface SortState {
  column: string;
  direction: SortDirection;
}

/** Pagination state */
export interface PaginationState {
  /** Current page index (0-based) */
  pageIndex: number;

  /** Items per page */
  pageSize: number;

  /** Total items in the dataset (before pagination) */
  totalItems: number;
}

/** Filter state for the search/filter bar */
export interface FilterState {
  /** Global search term applied across all columns */
  searchTerm: string;

  /** Per-column filters (column key -> filter value) */
  columnFilters?: Record<string, string>;
}

/** Row selection state */
export interface SelectionState<T = any> {
  /** Whether all visible rows are selected */
  allSelected: boolean;

  /** Set of selected row identifiers */
  selectedIds: Set<string | number>;
}

/** Events emitted by the dumb table */
export interface DataTableSortEvent {
  column: string;
  direction: SortDirection;
}

export interface DataTablePageEvent {
  pageIndex: number;
  pageSize: number;
}

export interface DataTableFilterEvent {
  searchTerm: string;
}

export interface DataTableSelectionEvent {
  selectedIds: (string | number)[];
  allSelected: boolean;
}

/** Page size options for the pagination bar */
export const DEFAULT_PAGE_SIZES = [10, 25, 50, 100];
