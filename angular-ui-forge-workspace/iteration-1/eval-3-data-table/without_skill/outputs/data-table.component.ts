import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  OnInit,
  OnDestroy,
  HostListener,
  TrackByFunction,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ColumnDef,
  SortState,
  SortDirection,
  FilterState,
  PaginationState,
  DataTableState,
  DEFAULT_PAGE_SIZES,
  CARD_BREAKPOINT,
} from './data-table.model';

/**
 * DataTableComponent -- Presentational / Smart-ish
 *
 * Full-featured data table with:
 *  - Column sorting (single-column, toggling asc/desc/none)
 *  - Column text filtering (per-column search)
 *  - Pagination with configurable page sizes
 *  - Row selection (checkbox, select-all, shift-click range)
 *  - Responsive: card-based layout on mobile, table on desktop
 *
 * Uses unigrid.css BEM classes directly (ug-table, ug-card, ug-btn, ug-form, ug-pagination).
 * No Bootstrap, no Tailwind.
 *
 * Design decisions:
 *  - Client-side sort/filter/paginate for simplicity; parent can also
 *    drive server-side via stateChange output.
 *  - OnPush change detection for performance.
 *  - trackBy on rows to minimize DOM churn.
 *  - Cards on mobile show first 2 visible columns as title/subtitle,
 *    rest as label-value pairs (progressive disclosure).
 *  - Empty and loading states built-in.
 */
@Component({
  selector: 'ui-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent<T extends Record<string, any> = Record<string, any>>
  implements OnInit, OnChanges, OnDestroy
{
  // ─── Static counter ─────────────────────────────────────
  private static nextId = 0;

  // ─── Inputs ─────────────────────────────────────────────

  /** Column definitions. */
  @Input() columns: ColumnDef<T>[] = [];

  /** Raw data rows. */
  @Input() data: T[] = [];

  /** Whether the table is in a loading state. */
  @Input() loading = false;

  /** Message shown when no data matches filters. */
  @Input() emptyMessage = 'No data available';

  /** Message shown during loading. */
  @Input() loadingMessage = 'Loading...';

  /** Whether to show the global search/filter bar. */
  @Input() filterable = true;

  /** Whether to show row selection checkboxes. */
  @Input() selectable = false;

  /** Whether to enable column sorting. */
  @Input() sortable = true;

  /** Whether to show pagination. */
  @Input() paginated = true;

  /** Available page sizes. */
  @Input() pageSizes: readonly number[] = DEFAULT_PAGE_SIZES;

  /** Initial page size. */
  @Input() pageSize = 10;

  /** Caption / accessible description. */
  @Input() caption = '';

  /** Unique trackBy field on each row (defaults to index). */
  @Input() trackByField = '';

  /** Whether to use striped rows. */
  @Input() striped = true;

  /** Unique instance ID for accessible labels. */
  @Input() tableId = `ui-dt-${DataTableComponent.nextId++}`;

  // ─── Outputs ────────────────────────────────────────────

  /** Emitted on every sort/filter/page/selection change. */
  @Output() stateChange = new EventEmitter<DataTableState<T>>();

  /** Emitted when row selection changes. */
  @Output() selectionChange = new EventEmitter<T[]>();

  /** Emitted when a row is clicked (not checkbox). */
  @Output() rowClick = new EventEmitter<T>();

  // ─── Internal state ─────────────────────────────────────

  /** Current sort. */
  sort: SortState | null = null;

  /** Per-column filter values (keyed by column key). */
  filterValues: Record<string, string> = {};

  /** Global search term. */
  globalFilter = '';

  /** Whether filter inputs are expanded. */
  filtersExpanded = false;

  /** Current page (1-based). */
  currentPage = 1;

  /** Rows per page. */
  currentPageSize = 10;

  /** Set of selected row indices (in filteredSortedData). */
  selectedIndices = new Set<number>();

  /** Whether all visible rows are selected. */
  allSelected = false;

  /** Processed data after filter + sort. */
  filteredSortedData: T[] = [];

  /** Paginated slice of filteredSortedData. */
  pageData: T[] = [];

  /** Total pages. */
  totalPages = 1;

  /** Whether we are in mobile card mode. */
  isMobile = false;

  /** Last clicked row index for shift-select range. */
  private lastClickedIndex: number | null = null;

  // ─── Lifecycle ──────────────────────────────────────────

  ngOnInit(): void {
    this.currentPageSize = this.pageSize;
    this.checkViewport();
    this.processData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['columns']) {
      this.processData();
    }
    if (changes['pageSize']) {
      this.currentPageSize = this.pageSize;
      this.processData();
    }
  }

  ngOnDestroy(): void {
    // Cleanup if needed.
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkViewport();
  }

  // ─── Viewport ───────────────────────────────────────────

  private checkViewport(): void {
    this.isMobile = window.innerWidth < CARD_BREAKPOINT;
  }

  // ─── Visible columns ───────────────────────────────────

  get visibleColumns(): ColumnDef<T>[] {
    return this.columns.filter((c) => c.visible !== false);
  }

  // ─── TrackBy ────────────────────────────────────────────

  trackByRow: TrackByFunction<T> = (index: number, row: T) => {
    if (this.trackByField && row[this.trackByField] != null) {
      return row[this.trackByField];
    }
    return index;
  };

  trackByColumn: TrackByFunction<ColumnDef<T>> = (_: number, col: ColumnDef<T>) => col.key;

  // ─── Sorting ────────────────────────────────────────────

  onSort(column: ColumnDef<T>): void {
    if (!this.sortable || !column.sortable) return;

    if (this.sort?.column === column.key) {
      // Cycle: asc -> desc -> null
      const next: SortDirection =
        this.sort.direction === 'asc' ? 'desc' : this.sort.direction === 'desc' ? null : 'asc';
      this.sort = next ? { column: column.key, direction: next } : null;
    } else {
      this.sort = { column: column.key, direction: 'asc' };
    }

    this.currentPage = 1;
    this.processData();
  }

  getSortIcon(column: ColumnDef<T>): string {
    if (!column.sortable) return '';
    if (this.sort?.column !== column.key) return '\u2195'; // ↕
    return this.sort.direction === 'asc' ? '\u2191' : '\u2193'; // ↑ ↓
  }

  getSortAriaLabel(column: ColumnDef<T>): string {
    if (!column.sortable) return column.label;
    if (this.sort?.column !== column.key) return `${column.label}, sortable`;
    return `${column.label}, sorted ${this.sort.direction === 'asc' ? 'ascending' : 'descending'}`;
  }

  // ─── Filtering ──────────────────────────────────────────

  onGlobalFilterChange(value: string): void {
    this.globalFilter = value;
    this.currentPage = 1;
    this.processData();
  }

  onColumnFilterChange(columnKey: string, value: string): void {
    this.filterValues[columnKey] = value;
    this.currentPage = 1;
    this.processData();
  }

  toggleFilters(): void {
    this.filtersExpanded = !this.filtersExpanded;
    if (!this.filtersExpanded) {
      this.clearAllFilters();
    }
  }

  clearAllFilters(): void {
    this.globalFilter = '';
    this.filterValues = {};
    this.currentPage = 1;
    this.processData();
  }

  get activeFilterCount(): number {
    let count = this.globalFilter ? 1 : 0;
    for (const key of Object.keys(this.filterValues)) {
      if (this.filterValues[key]) count++;
    }
    return count;
  }

  // ─── Pagination ─────────────────────────────────────────

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.slicePage();
    this.emitState();
  }

  onPageSizeChange(size: number): void {
    this.currentPageSize = size;
    this.currentPage = 1;
    this.processData();
  }

  get paginationPages(): (number | '...')[] {
    const total = this.totalPages;
    const current = this.currentPage;
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const pages: (number | '...')[] = [1];
    if (current > 3) pages.push('...');
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (current < total - 2) pages.push('...');
    pages.push(total);
    return pages;
  }

  get showingFrom(): number {
    return this.filteredSortedData.length === 0 ? 0 : (this.currentPage - 1) * this.currentPageSize + 1;
  }

  get showingTo(): number {
    return Math.min(this.currentPage * this.currentPageSize, this.filteredSortedData.length);
  }

  // ─── Selection ──────────────────────────────────────────

  onSelectAll(checked: boolean): void {
    this.allSelected = checked;
    this.selectedIndices.clear();
    if (checked) {
      this.pageData.forEach((_, i) => {
        this.selectedIndices.add((this.currentPage - 1) * this.currentPageSize + i);
      });
    }
    this.emitSelection();
  }

  onSelectRow(globalIndex: number, checked: boolean, event?: MouseEvent): void {
    if (event?.shiftKey && this.lastClickedIndex !== null) {
      const start = Math.min(this.lastClickedIndex, globalIndex);
      const end = Math.max(this.lastClickedIndex, globalIndex);
      for (let i = start; i <= end; i++) {
        if (checked) this.selectedIndices.add(i);
        else this.selectedIndices.delete(i);
      }
    } else {
      if (checked) this.selectedIndices.add(globalIndex);
      else this.selectedIndices.delete(globalIndex);
    }

    this.lastClickedIndex = globalIndex;
    this.updateAllSelected();
    this.emitSelection();
  }

  isRowSelected(pageIndex: number): boolean {
    const globalIndex = (this.currentPage - 1) * this.currentPageSize + pageIndex;
    return this.selectedIndices.has(globalIndex);
  }

  globalIndexOf(pageIndex: number): number {
    return (this.currentPage - 1) * this.currentPageSize + pageIndex;
  }

  private updateAllSelected(): void {
    if (this.pageData.length === 0) {
      this.allSelected = false;
      return;
    }
    const offset = (this.currentPage - 1) * this.currentPageSize;
    this.allSelected = this.pageData.every((_, i) => this.selectedIndices.has(offset + i));
  }

  private emitSelection(): void {
    const selected = Array.from(this.selectedIndices)
      .filter((i) => i < this.filteredSortedData.length)
      .map((i) => this.filteredSortedData[i]);
    this.selectionChange.emit(selected);
  }

  // ─── Row Click ──────────────────────────────────────────

  onRowClick(row: T): void {
    this.rowClick.emit(row);
  }

  // ─── Data Processing Pipeline ───────────────────────────

  private processData(): void {
    let result = [...this.data];

    // 1. Global filter
    if (this.globalFilter) {
      const term = this.globalFilter.toLowerCase();
      result = result.filter((row) =>
        this.visibleColumns.some((col) => {
          const val = row[col.key];
          return val != null && String(val).toLowerCase().includes(term);
        })
      );
    }

    // 2. Per-column filters
    for (const key of Object.keys(this.filterValues)) {
      const term = this.filterValues[key]?.toLowerCase();
      if (!term) continue;
      result = result.filter((row) => {
        const val = row[key];
        return val != null && String(val).toLowerCase().includes(term);
      });
    }

    // 3. Sort
    if (this.sort?.direction) {
      const { column, direction } = this.sort;
      const dir = direction === 'asc' ? 1 : -1;
      result.sort((a, b) => {
        const aVal = a[column];
        const bVal = b[column];
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return (aVal - bVal) * dir;
        }
        return String(aVal).localeCompare(String(bVal)) * dir;
      });
    }

    this.filteredSortedData = result;

    // 4. Pagination
    this.totalPages = Math.max(1, Math.ceil(result.length / this.currentPageSize));
    if (this.currentPage > this.totalPages) this.currentPage = 1;

    this.slicePage();
    this.selectedIndices.clear();
    this.allSelected = false;
    this.emitState();
  }

  private slicePage(): void {
    if (!this.paginated) {
      this.pageData = this.filteredSortedData;
      return;
    }
    const start = (this.currentPage - 1) * this.currentPageSize;
    this.pageData = this.filteredSortedData.slice(start, start + this.currentPageSize);
  }

  // ─── State Emission ─────────────────────────────────────

  private emitState(): void {
    const filters: FilterState[] = Object.entries(this.filterValues)
      .filter(([, v]) => !!v)
      .map(([column, value]) => ({ column, value }));

    if (this.globalFilter) {
      filters.unshift({ column: '__global__', value: this.globalFilter });
    }

    const state: DataTableState<T> = {
      sort: this.sort,
      filters,
      pagination: {
        page: this.currentPage,
        pageSize: this.currentPageSize,
        totalRows: this.filteredSortedData.length,
        totalPages: this.totalPages,
      },
      selectedRows: Array.from(this.selectedIndices)
        .filter((i) => i < this.filteredSortedData.length)
        .map((i) => this.filteredSortedData[i]),
    };
    this.stateChange.emit(state);
  }

  // ─── Cell Value Helper ──────────────────────────────────

  getCellValue(row: T, col: ColumnDef<T>): string {
    const raw = row[col.key];
    if (col.format) return col.format(raw, row);
    return raw != null ? String(raw) : '';
  }
}
