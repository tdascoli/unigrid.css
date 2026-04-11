import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  HostBinding,
  TrackByFunction,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  ColumnDef,
  SortState,
  SortDirection,
  FilterChip,
  PaginationState,
  SortChangeEvent,
  PageChangeEvent,
  SelectionChangeEvent,
  RowActionEvent,
  FilterRemoveEvent,
  DEFAULT_PAGE_SIZES,
} from './data-table.model';

/**
 * DataTableComponent (Dumb / Presentational)
 *
 * A fully accessible, responsive data table that renders:
 * - Desktop: a standard `<table>` with sortable headers, row selection, pagination
 * - Mobile (<768px): a card-based layout with the same data
 *
 * This component has zero injected services. All data flows through
 * inputs; all user actions flow out through outputs.
 *
 * ## Accessibility
 * - Sort buttons meet 44x44 touch target
 * - Pagination buttons meet 44x44 touch target
 * - Checkboxes wrapped in labels with 44x44 target
 * - Focus indicators use outline (not box-shadow)
 * - aria-sort on sorted columns, aria-current on active page
 * - Skeleton loading with aria-busy and role="status"
 * - Empty state with role="status"
 */
@Component({
  selector: 'ui-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent<T extends Record<string, unknown> = Record<string, unknown>> {
  // ---------------------------------------------------------------
  // Inputs
  // ---------------------------------------------------------------

  /** The column definitions for the table. */
  @Input() columns: ColumnDef<T>[] = [];

  /** The row data to display on the current page. */
  @Input() data: T[] = [];

  /** Unique key on each row used for tracking and selection. Defaults to 'id'. */
  @Input() rowIdKey = 'id';

  /** Current sort state. */
  @Input() sort: SortState = { column: '', direction: null };

  /** Active filter chips shown above the table. */
  @Input() filters: FilterChip[] = [];

  /** Pagination state. */
  @Input() pagination: PaginationState = {
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
  };

  /** Available page size options. */
  @Input() pageSizes: number[] = DEFAULT_PAGE_SIZES;

  /** Set of currently selected row IDs. */
  @Input() selectedIds: Set<string | number> = new Set();

  /** Whether the table is in a loading state. */
  @Input() loading = false;

  /** Whether row selection is enabled. */
  @Input() selectable = true;

  /** Search query string shown in the search input. */
  @Input() searchQuery = '';

  /** Placeholder text for the search input. */
  @Input() searchPlaceholder = 'Search...';

  /** Label for the entire table region (accessibility). */
  @Input() tableLabel = 'Data table';

  /** Number of skeleton rows to show when loading. */
  @Input() skeletonRows = 5;

  /** Custom empty state title. */
  @Input() emptyTitle = 'No results found';

  /** Custom empty state description. */
  @Input() emptyText = 'Try adjusting your search or filter criteria.';

  /** Whether to show the search bar. */
  @Input() showSearch = true;

  /** Whether to show the filter toggle button. */
  @Input() showFilterButton = true;

  // ---------------------------------------------------------------
  // Outputs
  // ---------------------------------------------------------------

  /** Emitted when a column sort is toggled. */
  @Output() sortChange = new EventEmitter<SortChangeEvent>();

  /** Emitted when the user changes page or page size. */
  @Output() pageChange = new EventEmitter<PageChangeEvent>();

  /** Emitted when row selection changes. */
  @Output() selectionChange = new EventEmitter<SelectionChangeEvent<T>>();

  /** Emitted when a row action button is clicked. */
  @Output() rowAction = new EventEmitter<RowActionEvent<T>>();

  /** Emitted when the search query changes. */
  @Output() searchChange = new EventEmitter<string>();

  /** Emitted when the filter toggle button is clicked. */
  @Output() filterToggle = new EventEmitter<void>();

  /** Emitted when a filter chip is removed. */
  @Output() filterRemove = new EventEmitter<FilterRemoveEvent>();

  /** Emitted when "Clear all" filters is clicked. */
  @Output() filtersClear = new EventEmitter<void>();

  // ---------------------------------------------------------------
  // Host
  // ---------------------------------------------------------------

  @HostBinding('class') hostClass = 'ui-data-table';
  @HostBinding('attr.role') hostRole = 'region';
  @HostBinding('attr.aria-label') get ariaLabel(): string {
    return this.tableLabel;
  }

  // ---------------------------------------------------------------
  // Computed helpers (template use)
  // ---------------------------------------------------------------

  /** Whether all visible rows are selected. */
  get allSelected(): boolean {
    if (!this.data.length) return false;
    return this.data.every((row) => this.selectedIds.has(this.getRowId(row)));
  }

  /** Whether some (but not all) visible rows are selected. */
  get someSelected(): boolean {
    if (!this.data.length) return false;
    const count = this.data.filter((row) => this.selectedIds.has(this.getRowId(row))).length;
    return count > 0 && count < this.data.length;
  }

  /** Total number of pages. */
  get totalPages(): number {
    return Math.max(1, Math.ceil(this.pagination.totalItems / this.pagination.pageSize));
  }

  /** Page numbers to render in pagination. */
  get pageNumbers(): number[] {
    const total = this.totalPages;
    const current = this.pagination.currentPage;
    const maxVisible = 5;

    if (total <= maxVisible) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;
    if (end > total) {
      end = total;
      start = Math.max(1, end - maxVisible + 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  /** Range text like "Showing 1-10 of 47". */
  get rangeText(): string {
    const { currentPage, pageSize, totalItems } = this.pagination;
    if (totalItems === 0) return 'No items';
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);
    return `Showing ${start}\u2013${end} of ${totalItems}`;
  }

  /** Number of selected items. */
  get selectedCount(): number {
    return this.selectedIds.size;
  }

  /** Columns visible on mobile cards. */
  get mobileColumns(): ColumnDef<T>[] {
    return this.columns.filter(
      (col) => col.visibleOnMobile !== false && col.type !== 'actions'
    );
  }

  /** The actions column, if any. */
  get actionsColumn(): ColumnDef<T> | undefined {
    return this.columns.find((col) => col.type === 'actions');
  }

  /** Array of skeleton row indices. */
  get skeletonRowArray(): number[] {
    return Array.from({ length: this.skeletonRows }, (_, i) => i);
  }

  // ---------------------------------------------------------------
  // TrackBy
  // ---------------------------------------------------------------

  trackByRow: TrackByFunction<T> = (_index: number, row: T) => this.getRowId(row);
  trackByColumn: TrackByFunction<ColumnDef<T>> = (_index: number, col: ColumnDef<T>) => col.key;
  trackByFilter: TrackByFunction<FilterChip> = (_index: number, filter: FilterChip) => filter.id;
  trackByPage: TrackByFunction<number> = (_index: number, page: number) => page;

  // ---------------------------------------------------------------
  // Event handlers
  // ---------------------------------------------------------------

  getRowId(row: T): string | number {
    return row[this.rowIdKey] as string | number;
  }

  getCellValue(row: T, col: ColumnDef<T>): unknown {
    return col.valueAccessor ? col.valueAccessor(row) : row[col.key];
  }

  getSortDirection(columnKey: string): SortDirection {
    return this.sort.column === columnKey ? this.sort.direction : null;
  }

  getAriaSortValue(columnKey: string): string | null {
    const dir = this.getSortDirection(columnKey);
    if (dir === 'asc') return 'ascending';
    if (dir === 'desc') return 'descending';
    return null;
  }

  onSortClick(column: ColumnDef<T>): void {
    if (column.sortable === false) return;
    const current = this.getSortDirection(column.key);
    let next: SortDirection;
    if (current === null) next = 'asc';
    else if (current === 'asc') next = 'desc';
    else next = null;

    this.sortChange.emit({ column: column.key, direction: next });
  }

  onSelectAll(checked: boolean): void {
    const newSet = new Set(this.selectedIds);
    this.data.forEach((row) => {
      const id = this.getRowId(row);
      if (checked) newSet.add(id);
      else newSet.delete(id);
    });
    this.selectionChange.emit({
      selected: this.data.filter((row) => newSet.has(this.getRowId(row))),
      allSelected: checked,
    });
  }

  onRowSelect(row: T, checked: boolean): void {
    const newSet = new Set(this.selectedIds);
    const id = this.getRowId(row);
    if (checked) newSet.add(id);
    else newSet.delete(id);

    const selectedRows = this.data.filter((r) => newSet.has(this.getRowId(r)));
    this.selectionChange.emit({
      selected: selectedRows,
      allSelected: selectedRows.length === this.data.length,
    });
  }

  isRowSelected(row: T): boolean {
    return this.selectedIds.has(this.getRowId(row));
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchChange.emit(value);
  }

  onPageSizeChange(event: Event): void {
    const size = Number((event.target as HTMLSelectElement).value);
    this.pageChange.emit({ page: 1, pageSize: size });
  }

  onPageClick(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.pageChange.emit({ page, pageSize: this.pagination.pageSize });
  }

  onRowActionClick(action: string, row: T): void {
    this.rowAction.emit({ action, row });
  }

  onFilterRemoveClick(filter: FilterChip): void {
    this.filterRemove.emit({ filterId: filter.id });
  }

  onClearFilters(): void {
    this.filtersClear.emit();
  }

  onFilterToggle(): void {
    this.filterToggle.emit();
  }
}
