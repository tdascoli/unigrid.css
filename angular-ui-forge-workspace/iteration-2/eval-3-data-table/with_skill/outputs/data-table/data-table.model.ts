/**
 * Data Table — Interfaces & Types
 *
 * Defines the contract between the smart container and the dumb
 * presentational data-table component.
 */

/** Sort direction for a column. */
export type SortDirection = 'asc' | 'desc' | null;

/** Describes the current sort state. */
export interface SortState {
  /** The column key that is currently sorted. */
  column: string;
  /** The direction of the sort. */
  direction: SortDirection;
}

/** Describes a single column definition. */
export interface ColumnDef<T = unknown> {
  /** Unique key that maps to a property on the row data object. */
  key: string;
  /** Human-readable header label. */
  label: string;
  /** Whether this column is sortable. Defaults to true. */
  sortable?: boolean;
  /** Optional cell template type hint (e.g. 'status', 'date', 'actions'). */
  type?: 'text' | 'status' | 'date' | 'actions' | 'custom';
  /**
   * Optional function to extract a display value from the row.
   * Falls back to `row[key]` when not provided.
   */
  valueAccessor?: (row: T) => unknown;
  /** Whether to show this column on mobile card layout. Defaults to true. */
  visibleOnMobile?: boolean;
  /** Optional CSS width hint (e.g. '200px', '20%'). */
  width?: string;
}

/** Describes a single active filter. */
export interface FilterChip {
  /** Unique identifier for this filter instance. */
  id: string;
  /** The column key this filter applies to. */
  column: string;
  /** Human-readable label shown in the chip (e.g. "Status: Active"). */
  label: string;
  /** The raw filter value. */
  value: unknown;
}

/** Pagination state. */
export interface PaginationState {
  /** Current page index (1-based). */
  currentPage: number;
  /** Number of rows per page. */
  pageSize: number;
  /** Total number of rows (before pagination, after filtering). */
  totalItems: number;
}

/** Page size options for the rows-per-page selector. */
export const DEFAULT_PAGE_SIZES: number[] = [5, 10, 25, 50];

/** Events emitted by the data-table component. */

export interface SortChangeEvent {
  column: string;
  direction: SortDirection;
}

export interface PageChangeEvent {
  page: number;
  pageSize: number;
}

export interface SelectionChangeEvent<T = unknown> {
  selected: T[];
  allSelected: boolean;
}

export interface RowActionEvent<T = unknown> {
  action: string;
  row: T;
}

export interface FilterRemoveEvent {
  filterId: string;
}

/** Status variant for the built-in status badge renderer. */
export type StatusVariant = 'active' | 'inactive' | 'pending' | 'error';
