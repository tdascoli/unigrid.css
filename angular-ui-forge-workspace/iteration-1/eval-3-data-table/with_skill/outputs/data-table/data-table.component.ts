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
import { FormsModule } from '@angular/forms';

import {
  ColumnDef,
  SortState,
  PaginationState,
  DataTableSortEvent,
  DataTablePageEvent,
  DataTableFilterEvent,
  DataTableSelectionEvent,
  DEFAULT_PAGE_SIZES,
} from './data-table.model';

/**
 * Dumb (Presentational) Data Table Component
 *
 * Renders a responsive data table with sorting, filtering, pagination,
 * and row selection. On small screens it switches to a card-based layout.
 *
 * This component is fully controlled via inputs — it owns zero state.
 * All mutations are communicated through outputs.
 *
 * Accessibility:
 * - Uses <table> with proper <thead>/<tbody> semantics on desktop
 * - Sort buttons have aria-sort attributes
 * - Checkboxes have aria-label for screen readers
 * - Card view uses role="list" / role="listitem"
 * - Pagination controls are labelled with aria-label
 * - Focus indicators meet WCAG 2.4.7 (3px high-contrast outline)
 */
@Component({
  selector: 'ui-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent {
  // ── Data ──────────────────────────────────────────────────────────

  /** Column definitions */
  @Input() columns: ColumnDef[] = [];

  /** Row data currently visible (already sorted, filtered, paginated by container) */
  @Input() rows: any[] = [];

  /** Unique key on each row object used for tracking and selection */
  @Input() rowIdKey = 'id';

  // ── Sort ──────────────────────────────────────────────────────────

  /** Current sort state */
  @Input() sort: SortState = { column: '', direction: null };

  @Output() sortChanged = new EventEmitter<DataTableSortEvent>();

  // ── Filter ────────────────────────────────────────────────────────

  /** Current search term (bound to the filter input) */
  @Input() searchTerm = '';

  /** Placeholder text for the search input */
  @Input() searchPlaceholder = 'Search...';

  @Output() filterChanged = new EventEmitter<DataTableFilterEvent>();

  // ── Pagination ────────────────────────────────────────────────────

  @Input() pagination: PaginationState = { pageIndex: 0, pageSize: 10, totalItems: 0 };

  @Input() pageSizeOptions: number[] = DEFAULT_PAGE_SIZES;

  @Output() pageChanged = new EventEmitter<DataTablePageEvent>();

  // ── Selection ─────────────────────────────────────────────────────

  /** Enable row selection checkboxes */
  @Input() selectable = false;

  /** IDs of currently selected rows */
  @Input() selectedIds: (string | number)[] = [];

  /** Whether the "select all" checkbox is checked */
  @Input() allSelected = false;

  @Output() selectionChanged = new EventEmitter<DataTableSelectionEvent>();

  // ── State ─────────────────────────────────────────────────────────

  /** Show the loading skeleton */
  @Input() loading = false;

  /** Text shown when rows array is empty and not loading */
  @Input() emptyMessage = 'No data found.';

  /** Label shown above the table (optional) */
  @Input() caption = '';

  // ── Host ──────────────────────────────────────────────────────────

  @HostBinding('class') hostClass = 'ui-data-table';

  // ── Template helpers ──────────────────────────────────────────────

  /** TrackBy for *ngFor rows */
  trackByRow: TrackByFunction<any> = (_index: number, row: any) =>
    row[this.rowIdKey] ?? _index;

  /** TrackBy for columns */
  trackByCol: TrackByFunction<ColumnDef> = (_index: number, col: ColumnDef) => col.key;

  /** Total page count */
  get totalPages(): number {
    return Math.max(1, Math.ceil(this.pagination.totalItems / this.pagination.pageSize));
  }

  /** Range label, e.g. "1 - 10 of 47" */
  get rangeLabel(): string {
    const start = this.pagination.pageIndex * this.pagination.pageSize + 1;
    const end = Math.min(start + this.pagination.pageSize - 1, this.pagination.totalItems);
    if (this.pagination.totalItems === 0) return '0 items';
    return `${start}\u2013${end} of ${this.pagination.totalItems}`;
  }

  /** Visible page numbers for pagination (max 5 pages shown) */
  get visiblePages(): number[] {
    const total = this.totalPages;
    const current = this.pagination.pageIndex;
    const pages: number[] = [];

    let start = Math.max(0, current - 2);
    let end = Math.min(total - 1, start + 4);
    start = Math.max(0, end - 4);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  /** Columns visible in mobile card view */
  get mobileColumns(): ColumnDef[] {
    return this.columns.filter((c) => c.visibleOnMobile !== false);
  }

  /** Skeleton rows for loading state */
  get skeletonRows(): number[] {
    return Array.from({ length: this.pagination.pageSize }, (_, i) => i);
  }

  // ── Handlers ──────────────────────────────────────────────────────

  onSort(column: ColumnDef): void {
    if (column.sortable === false) return;

    let direction: 'asc' | 'desc' | null = 'asc';
    if (this.sort.column === column.key) {
      if (this.sort.direction === 'asc') direction = 'desc';
      else if (this.sort.direction === 'desc') direction = null;
    }

    this.sortChanged.emit({ column: column.key, direction });
  }

  getSortIcon(column: ColumnDef): string {
    if (this.sort.column !== column.key || this.sort.direction === null) return '\u2195';
    return this.sort.direction === 'asc' ? '\u2191' : '\u2193';
  }

  getAriaSortValue(column: ColumnDef): string {
    if (this.sort.column !== column.key || this.sort.direction === null) return 'none';
    return this.sort.direction === 'asc' ? 'ascending' : 'descending';
  }

  onSearchInput(value: string): void {
    this.filterChanged.emit({ searchTerm: value });
  }

  clearSearch(): void {
    this.filterChanged.emit({ searchTerm: '' });
  }

  onPageSizeChange(size: number): void {
    this.pageChanged.emit({ pageIndex: 0, pageSize: size });
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages) return;
    this.pageChanged.emit({ pageIndex: page, pageSize: this.pagination.pageSize });
  }

  onToggleAll(checked: boolean): void {
    if (checked) {
      const allIds = this.rows.map((r) => r[this.rowIdKey]);
      this.selectionChanged.emit({ selectedIds: allIds, allSelected: true });
    } else {
      this.selectionChanged.emit({ selectedIds: [], allSelected: false });
    }
  }

  onToggleRow(rowId: string | number, checked: boolean): void {
    const current = new Set(this.selectedIds);
    if (checked) {
      current.add(rowId);
    } else {
      current.delete(rowId);
    }
    const ids = Array.from(current);
    this.selectionChanged.emit({
      selectedIds: ids,
      allSelected: ids.length === this.rows.length && this.rows.length > 0,
    });
  }

  isSelected(row: any): boolean {
    return this.selectedIds.includes(row[this.rowIdKey]);
  }

  getCellValue(row: any, col: ColumnDef): string {
    const raw = row[col.key];
    if (col.format) return col.format(raw, row);
    if (raw == null) return '';
    return String(raw);
  }

  getAlignClass(col: ColumnDef): string {
    if (col.align === 'center') return 'ui-data-table__cell--center';
    if (col.align === 'right') return 'ui-data-table__cell--right';
    return '';
  }
}
