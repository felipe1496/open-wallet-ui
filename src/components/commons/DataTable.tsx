import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/functions';

export interface Column<T> {
  id: string;
  title: ReactNode;
  render?: (value: T) => ReactNode;
  trClassName?: string;
  isLoading?: ReactNode;
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  getRowProps?: (row: T) => HTMLAttributes<HTMLTableRowElement>;
  groupBy?: (row: T) => string;
}

export const DataTable = <T,>({
  columns,
  data,
  isLoading = false,
  getRowProps,
  groupBy,
}: Props<T>) => {
  function renderRows() {
    if (isLoading) {
      return Array.from({ length: 10 }).map((_, rowIndex) => (
        <tr key={`table-row-${rowIndex}`}>
          {columns.map((column) => (
            <td
              key={`table-cell-${rowIndex}-${String(column.id)}`}
              className={cn('px-3 py-1.5', column.trClassName)}
            >
              {column.isLoading ?? null}
            </td>
          ))}
        </tr>
      ));
    }

    if (data.length === 0) {
      return (
        <tr>
          <td colSpan={columns.length} className="px-3 py-1.5 text-center text-sm text-zinc-500">
            No data found
          </td>
        </tr>
      );
    }

    const groupedData = data.reduce<Record<string, T[]>>((acc, row) => {
      const key = groupBy ? groupBy(row) : 'default';
      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(row);
      return acc;
    }, {});

    return Object.entries(groupedData).flatMap(([group, rows]) => {
      const groupHeader: ReactNode[] = [];

      if (groupBy) {
        groupHeader.push(
          <tr key={`group-${group}`} className="border-b border-zinc-200 bg-zinc-50">
            <td colSpan={columns.length} className="px-3 py-1 text-sm text-zinc-500">
              {group}
            </td>
          </tr>,
        );
      }

      const groupRows = rows.map((row, rowIndex) => {
        const rowProps = getRowProps?.(row) || {};
        const { className: rowClassName, ...rest } = rowProps;
        return (
          <tr key={`table-row-${group}-${rowIndex}`} {...rest} className={cn(rowClassName)}>
            {columns.map((column) => {
              const padding = rowIndex === rows.length - 1 ? 'px-3 py-1' : 'px-3 pt-1';
              return (
                <td
                  key={`table-cell-${group}-${rowIndex}-${String(column.id)}`}
                  className={cn(padding, column.trClassName)}
                >
                  {column.render?.(row) ?? null}
                </td>
              );
            })}
          </tr>
        );
      });

      return [...groupHeader, ...groupRows];
    });
  }
  return (
    <table className="w-full">
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={`table-column-${String(column.id)}`}
              className={cn('bg-zinc-100 px-3 py-1.5 text-sm font-semibold', column.trClassName)}
            >
              {column.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{renderRows()}</tbody>
    </table>
  );
};
