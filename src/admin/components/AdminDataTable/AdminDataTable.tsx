import React, { useState } from 'react';
import './AdminDataTable.css';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface AdminDataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  isLoading?: boolean;
  emptyMessage?: string;
  searchPlaceholder?: string;
  onSearch?: (term: string) => void;
  actions?: React.ReactNode;
  pagination?: {
    pageSize?: number;
  };
}

export function AdminDataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyMessage = 'No data available',
  searchPlaceholder,
  onSearch,
  actions,
  pagination,
}: AdminDataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = pagination?.pageSize || 10;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    setCurrentPage(1);
    if (onSearch) {
      onSearch(val);
    }
  };

  const totalPages = Math.ceil(data.length / pageSize) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const visibleData = pagination ? data.slice(startIndex, startIndex + pageSize) : data;

  return (
    <div className="pg-admin-table-container">
      {(searchPlaceholder || actions) && (
        <div className="pg-admin-table-toolbar">
          {searchPlaceholder && (
            <div className="pg-admin-table-search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="pg-admin-table-search__input"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="pg-admin-table-search__clear"
                  onClick={() => {
                    setSearchTerm('');
                    if (onSearch) onSearch('');
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {actions && <div className="pg-admin-table-actions">{actions}</div>}
        </div>
      )}

      <div className="pg-admin-table-scroll">
        <table className="pg-admin-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width, textAlign: col.align || 'left' }}
                  className="pg-admin-table__th"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="pg-admin-table__loading">
                  <div className="pg-admin-spinner" />
                  <span>Loading records...</span>
                </td>
              </tr>
            ) : visibleData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="pg-admin-table__empty">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              visibleData.map((item) => (
                <tr key={keyExtractor(item)} className="pg-admin-table__tr">
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{ textAlign: col.align || 'left' }}
                      className="pg-admin-table__td"
                    >
                      {col.render
                        ? col.render(item)
                        : (item as Record<string, unknown>)[col.key] != null
                        ? String((item as Record<string, unknown>)[col.key])
                        : '—'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && data.length > pageSize && (
        <div className="pg-admin-table-pagination">
          <span className="pg-admin-table-pagination__info">
            Showing {startIndex + 1} to {Math.min(startIndex + pageSize, data.length)} of {data.length} entries
          </span>
          <div className="pg-admin-table-pagination__controls">
            <button
              type="button"
              className="pg-admin-table-pagination__btn"
              disabled={safePage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <span className="pg-admin-table-pagination__page">
              Page {safePage} of {totalPages}
            </span>
            <button
              type="button"
              className="pg-admin-table-pagination__btn"
              disabled={safePage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
