import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, BehaviorSubject, combineLatest, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  takeUntil,
  tap,
  catchError,
} from 'rxjs/operators';

import { DataTableComponent } from '../data-table/data-table.component';
import {
  ColumnDef,
  SortState,
  SortChangeEvent,
  PageChangeEvent,
  SelectionChangeEvent,
  RowActionEvent,
  FilterChip,
  FilterRemoveEvent,
  PaginationState,
} from '../data-table/data-table.model';

/**
 * A generic data service interface.
 * In a real application, replace or extend this with your actual service.
 */
export interface DataTableService<T> {
  fetchData(params: DataFetchParams): Promise<DataFetchResult<T>> | DataFetchResult<T>;
}

export interface DataFetchParams {
  page: number;
  pageSize: number;
  sort: SortState;
  searchQuery: string;
  filters: FilterChip[];
}

export interface DataFetchResult<T> {
  data: T[];
  totalItems: number;
}

/**
 * DataTableContainerComponent (Smart / Container)
 *
 * Orchestrates data fetching, sorting, filtering, pagination, and selection
 * for the presentational DataTableComponent.
 *
 * ## Responsibilities
 * - Manages reactive state for sort, pagination, search, filters
 * - Debounces search input
 * - Delegates data fetching to an injected service
 * - Passes processed data down to the dumb DataTableComponent
 * - Handles row action events (edit, delete) and delegates to service
 *
 * ## Usage
 * Extend this class or configure it via inputs for the specific data domain.
 * Override the `dataService` injection and `columns` definition.
 */
@Component({
  selector: 'feature-data-table-container',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './data-table-container.component.html',
  styleUrl: './data-table-container.component.scss',
})
export class DataTableContainerComponent<T extends Record<string, unknown> = Record<string, unknown>>
  implements OnInit, OnDestroy
{
  // ---------------------------------------------------------------
  // Configuration — override in subclass or set via route data
  // ---------------------------------------------------------------

  /** Column definitions. Override in subclass. */
  columns: ColumnDef<T>[] = [];

  /** Unique key for row identity. */
  rowIdKey = 'id';

  /** Table accessibility label. */
  tableLabel = 'Data table';

  // ---------------------------------------------------------------
  // Reactive state subjects
  // ---------------------------------------------------------------

  protected sort$ = new BehaviorSubject<SortState>({ column: '', direction: null });
  protected pagination$ = new BehaviorSubject<PaginationState>({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
  });
  protected searchQuery$ = new BehaviorSubject<string>('');
  protected filters$ = new BehaviorSubject<FilterChip[]>([]);
  protected selectedIds$ = new BehaviorSubject<Set<string | number>>(new Set());

  // ---------------------------------------------------------------
  // Derived state for template
  // ---------------------------------------------------------------

  data: T[] = [];
  loading = false;
  sort: SortState = { column: '', direction: null };
  pagination: PaginationState = { currentPage: 1, pageSize: 10, totalItems: 0 };
  searchQuery = '';
  filters: FilterChip[] = [];
  selectedIds = new Set<string | number>();

  // ---------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    // Combine all query params into a single stream
    combineLatest([
      this.sort$,
      this.pagination$,
      this.searchQuery$.pipe(debounceTime(300), distinctUntilChanged()),
      this.filters$,
    ])
      .pipe(
        tap(() => {
          this.loading = true;
        }),
        switchMap(([sort, pagination, searchQuery, filters]) => {
          const params: DataFetchParams = {
            page: pagination.currentPage,
            pageSize: pagination.pageSize,
            sort,
            searchQuery,
            filters,
          };
          return this.fetchData(params);
        }),
        catchError(() => {
          this.loading = false;
          return of({ data: [] as T[], totalItems: 0 });
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((result) => {
        this.data = result.data;
        this.pagination = {
          ...this.pagination$.getValue(),
          totalItems: result.totalItems,
        };
        this.loading = false;
      });

    // Sync local state from subjects for template binding
    this.sort$.pipe(takeUntil(this.destroy$)).subscribe((s) => (this.sort = s));
    this.searchQuery$.pipe(takeUntil(this.destroy$)).subscribe((q) => (this.searchQuery = q));
    this.filters$.pipe(takeUntil(this.destroy$)).subscribe((f) => (this.filters = f));
    this.selectedIds$.pipe(takeUntil(this.destroy$)).subscribe((ids) => (this.selectedIds = ids));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ---------------------------------------------------------------
  // Data fetching — override in subclass
  // ---------------------------------------------------------------

  /**
   * Override this method to provide actual data fetching logic.
   * The default implementation returns empty results.
   */
  protected fetchData(params: DataFetchParams): Promise<DataFetchResult<T>> | any {
    return Promise.resolve({ data: [], totalItems: 0 });
  }

  // ---------------------------------------------------------------
  // Event handlers (called from template)
  // ---------------------------------------------------------------

  onSortChange(event: SortChangeEvent): void {
    this.sort$.next({ column: event.column, direction: event.direction });
  }

  onPageChange(event: PageChangeEvent): void {
    this.pagination$.next({
      ...this.pagination$.getValue(),
      currentPage: event.page,
      pageSize: event.pageSize,
    });
    // Clear selection on page change
    this.selectedIds$.next(new Set());
  }

  onSelectionChange(event: SelectionChangeEvent<T>): void {
    const newIds = new Set<string | number>();
    event.selected.forEach((row) => {
      const id = row[this.rowIdKey] as string | number;
      newIds.add(id);
    });
    this.selectedIds$.next(newIds);
  }

  onSearchChange(query: string): void {
    this.searchQuery$.next(query);
    // Reset to first page on search
    this.pagination$.next({
      ...this.pagination$.getValue(),
      currentPage: 1,
    });
  }

  onFilterToggle(): void {
    // Override in subclass to show/hide a filter panel
  }

  onFilterRemove(event: FilterRemoveEvent): void {
    const current = this.filters$.getValue();
    this.filters$.next(current.filter((f) => f.id !== event.filterId));
    // Reset to first page
    this.pagination$.next({
      ...this.pagination$.getValue(),
      currentPage: 1,
    });
  }

  onFiltersClear(): void {
    this.filters$.next([]);
    this.pagination$.next({
      ...this.pagination$.getValue(),
      currentPage: 1,
    });
  }

  onRowAction(event: RowActionEvent<T>): void {
    // Override in subclass to handle specific row actions
    switch (event.action) {
      case 'edit':
        this.handleEdit(event.row);
        break;
      case 'delete':
        this.handleDelete(event.row);
        break;
    }
  }

  /**
   * Override in subclass to handle edit action.
   */
  protected handleEdit(row: T): void {
    // Default: no-op. Subclass should navigate or open a dialog.
  }

  /**
   * Override in subclass to handle delete action.
   */
  protected handleDelete(row: T): void {
    // Default: no-op. Subclass should show confirmation dialog.
  }

  // ---------------------------------------------------------------
  // Bulk actions (called from template)
  // ---------------------------------------------------------------

  onBulkExport(): void {
    // Override in subclass
  }

  onBulkDelete(): void {
    // Override in subclass
  }
}
