import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '../../utils/functions';
import { useTranslation } from 'react-i18next';

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  className?: string;
}

export const TablePagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage = 10,
  className,
}: TablePaginationProps) => {
  const { t } = useTranslation();

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const showEllipsisStart = currentPage > 3;
    const showEllipsisEnd = currentPage < totalPages - 2;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (showEllipsisStart) {
        pages.push('ellipsis');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (showEllipsisEnd) {
        pages.push('ellipsis');
      }

      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems || 0);

  return (
    <div
      className={cn(
        'border-muted-foreground flex items-center border-t px-4 py-3',
        totalItems !== undefined ? 'justify-between' : 'justify-end',
        className,
      )}
    >
      {/* Info text */}
      {totalItems !== undefined && (
        <span className="text-muted-foreground text-sm">
          {t('common.pagination.showingItems', {
            start: startItem,
            end: endItem,
            total: totalItems,
          })}
        </span>
      )}

      {/* Pagination controls */}
      <div className="flex items-center gap-1">
        {/* First page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={cn(
            'flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-colors',
            'text-muted-foreground hover:text-foreground hover:bg-zinc-800',
            'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent',
          )}
          aria-label={t('common.pagination.firstPage')}
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>

        {/* Previous page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            'flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-colors',
            'text-muted-foreground hover:text-foreground hover:bg-zinc-800',
            'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent',
          )}
          aria-label={t('common.pagination.previousPage')}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Page numbers */}
        <div className="mx-2 flex items-center gap-1">
          {getPageNumbers().map((page, index) =>
            page === 'ellipsis' ? (
              <span
                key={`ellipsis-${index}`}
                className="text-muted-foreground flex h-8 w-8 items-center justify-center"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={cn(
                  'flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-md px-2 text-sm font-medium transition-colors',
                  currentPage === page
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-zinc-800',
                )}
                aria-label={t('common.pagination.page', { page })}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            ),
          )}
        </div>

        {/* Next page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            'flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-colors',
            'text-muted-foreground hover:text-foreground hover:bg-zinc-800',
            'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent',
          )}
          aria-label={t('common.pagination.nextPage')}
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Last page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={cn(
            'flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-colors',
            'text-muted-foreground hover:text-foreground hover:bg-zinc-800',
            'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent',
          )}
          aria-label={t('common.pagination.lastPage')}
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
