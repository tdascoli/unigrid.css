import { Component, ChangeDetectionStrategy, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, combineLatest, Observable, map } from 'rxjs';

import {
  DataTableComponent,
  ColumnDef,
  SortState,
  PaginationState,
  DataTableSortEvent,
  DataTablePageEvent,
  DataTableFilterEvent,
  DataTableSelectionEvent,
  DEFAULT_PAGE_SIZES,
} from '../data-table';

/**
 * Smart (Container) Data Table Component
 *
 * Orchestrates data flow for the presentational DataTableComponent.
 * Owns sorting, filtering, pagination, and selection state.
 * Accepts the full dataset and column definitions as inputs,
 * then computes the visible page of rows reactively.
 *
 * In a real application this would typically inject a data service
 * and handle server-side sorting/pagination. This reference
 * implementation demonstrates the client-side variant.
 */
@Component({
  selector: 'feature-data-table',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './data-table-container.component.html',
  styleUrl: './data-table-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableContainerComponent implements OnInit {
  // ── Inputs (provided by the parent page / route) ──────────────

  /** Full dataset — the container handles sort/filter/paginate */
  @Input() data: any[] = [];

  /** Column definitions passed through to the dumb component */
  @Input() columns: ColumnDef[] = [];

  /** Unique row identifier key */
  @Input() rowIdKey = 'id';

  /** Whether rows are selectable */
  @Input() selectable = false;

  /** Available page sizes */
  @Input() pageSizeOptions: number[] = DEFAULT_PAGE_SIZES;

  /** Default page size */
  @Input() defaultPageSize = 10;

  /** Table caption */
  @Input() caption = '';

  /** Search placeholder */
  @Input() searchPlaceholder = 'Search...';

  /** Empty state message */
  @Input() emptyMessage = 'No data found.';

  /** Simulate loading state */
  @Input() loading = false;

  // ── Reactive State ────────────────────────────────────────────

  private sort$ = new BehaviorSubject<SortState>({ column: '', direction: null });
  private filter$ = new BehaviorSubject<string>('');
  private page$ = new BehaviorSubject<{ pageIndex: number; pageSize: number }>({
    pageIndex: 0,
    pageSize: 10,
  });
  private selectedIds$ = new BehaviorSubject<(string | number)[]>([]);

  /** Exposed sort state for template binding */
  sortState$!: Observable<SortState>;

  /** Exposed search term */
  searchTerm$!: Observable<string>;

  /** Computed visible rows (sorted + filtered + paginated) */
  visibleRows$!: Observable<any[]>;

  /** Computed pagination state (includes totalItems from filtered set) */
  pagination$!: Observable<PaginationState>;

  /** Selected IDs */
  selection$!: Observable<(string | number)[]>;

  /** Whether all visible rows are selected */
  allSelected$!: Observable<boolean>;

  ngOnInit(): void {
    this.page$.next({ pageIndex: 0, pageSize: this.defaultPageSize });

    // Build the filtered + sorted dataset
    const processedData$ = combineLatest([this.sort$, this.filter$]).pipe(
      map(([sort, filterTerm]) => {
        let result = [...this.data];

        // Filter
        if (filterTerm.trim()) {
          const term = filterTerm.toLowerCase();
          result = result.filter((row) =>
            this.columns.some((col) => {
              const val = row[col.key];
              return val != null && String(val).toLowerCase().includes(term);
            })
          );
        }

        // Sort
        if (sort.column && sort.direction) {
          const dir = sort.direction === 'asc' ? 1 : -1;
          result.sort((a, b) => {
            const aVal = a[sort.column];
            const bVal = b[sort.column];
            if (aVal == null && bVal == null) return 0;
            if (aVal == null) return 1;
            if (bVal == null) return -1;
            if (typeof aVal === 'number' && typeof bVal === 'number') {
              return (aVal - bVal) * dir;
            }
            return String(aVal).localeCompare(String(bVal)) * dir;
          });
        }

        return result;
      })
    );

    // Pagination state (needs filtered total)
    this.pagination$ = combineLatest([processedData$, this.page$]).pipe(
      map(([data, page]) => ({
        pageIndex: page.pageIndex,
        pageSize: page.pageSize,
        totalItems: data.length,
      }))
    );

    // Visible rows = slice of processed data
    this.visibleRows$ = combineLatest([processedData$, this.page$]).pipe(
      map(([data, page]) => {
        const start = page.pageIndex * page.pageSize;
        return data.slice(start, start + page.pageSize);
      })
    );

    this.sortState$ = this.sort$.asObservable();
    this.searchTerm$ = this.filter$.asObservable();
    this.selection$ = this.selectedIds$.asObservable();

    this.allSelected$ = combineLatest([this.visibleRows$, this.selectedIds$]).pipe(
      map(([rows, ids]) => rows.length > 0 && rows.every((r) => ids.includes(r[this.rowIdKey])))
    );
  }

  // ── Event Handlers (bridge dumb component events to state) ────

  onSortChanged(event: DataTableSortEvent): void {
    this.sort$.next({ column: event.column, direction: event.direction });
  }

  onFilterChanged(event: DataTableFilterEvent): void {
    this.filter$.next(event.searchTerm);
    // Reset to first page when filter changes (progressive disclosure — show fresh results)
    const current = this.page$.value;
    this.page$.next({ ...current, pageIndex: 0 });
  }

  onPageChanged(event: DataTablePageEvent): void {
    this.page$.next({ pageIndex: event.pageIndex, pageSize: event.pageSize });
  }

  onSelectionChanged(event: DataTableSelectionEvent): void {
    this.selectedIds$.next(event.selectedIds);
  }
}
