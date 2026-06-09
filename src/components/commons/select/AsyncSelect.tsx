import { Check, ChevronsUpDown, LoaderCircleIcon, Plus, Search, XIcon } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandLoading,
} from 'cmdk';
import { Popover, PopoverContent, PopoverTrigger } from '../Popover';
import { cn } from '../../../utils/functions';
import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export interface Option<T> {
  id: string;
  value: T;
  label: ReactNode;
  disabled?: boolean;
}

interface Props<T> {
  options: Option<T>[];
  selected?: Option<T> | null;
  onSelectedChange?: (value: Option<T> | null) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  onSearchChange?: (value: string) => void;
  search?: string;
  onCreate?: (value: string) => void;
}

export function AsyncSelect<T>({
  options,
  selected,
  onSelectedChange,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  className,
  disabled = false,
  isLoading = false,
  onSearchChange = () => {},
  search,
  onCreate,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const placeholderText = placeholder ?? t('common.select.placeholder');
  const searchPlaceholderText = searchPlaceholder ?? t('common.select.searchPlaceholder');
  const emptyMessageText = emptyMessage ?? t('common.select.emptyMessage');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          role="combobox"
          aria-expanded={open}
          aria-disabled={disabled}
          data-disabled={disabled ? '' : undefined}
          tabIndex={disabled ? -1 : 0}
          onPointerDown={(e) => disabled && e.preventDefault()}
          onClick={(e) => disabled && e.preventDefault()}
          onKeyDown={(e) => disabled && e.preventDefault()}
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-md border border-zinc-300 px-2 text-sm',
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
            !selected && 'text-muted-foreground',
            className,
          )}
        >
          {selected ? selected.label : placeholderText}
          <div className="flex items-center gap-2">
            <div
              role="button"
              tabIndex={disabled ? -1 : 0}
              aria-label={t('common.select.clearSelection')}
              onKeyDown={(evt) => {
                if (evt.key === 'Enter' || evt.key === ' ') {
                  evt.preventDefault();
                  evt.stopPropagation();
                  onSelectedChange?.(null);
                }
              }}
              onClick={(evt) => {
                evt.preventDefault();
                evt.stopPropagation();
                onSelectedChange?.(null);
              }}
              className={cn(
                'flex items-center justify-center rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-zinc-400',
                disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
              )}
            >
              <XIcon className="size-4 text-zinc-400" />
            </div>

            <div className="h-5 w-px bg-zinc-300" />

            {isLoading ? (
              <LoaderCircleIcon className="text-muted-foreground size-4 animate-spin" />
            ) : (
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            )}
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <div className="flex items-center border-b border-zinc-300 px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              placeholder={searchPlaceholderText}
              className="placeholder:text-muted-foreground flex h-10 w-full rounded-md border-0 bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
              value={search}
              onChange={(evt) => onSearchChange(evt.target.value)}
            />
          </div>
          {isLoading ? (
            <CommandLoading className="flex items-center justify-center p-2">
              <LoaderCircleIcon className="text-muted-foreground size-5 animate-spin" />
            </CommandLoading>
          ) : (
            <CommandList className="p-1">
              <CommandEmpty className="text-muted-foreground px-2 py-1 text-sm">
                {emptyMessageText}
              </CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.id}
                    value={option.id}
                    disabled={option.disabled}
                    onSelect={() => {
                      if (option.disabled) return;
                      if (selected?.id === option.id) {
                        onSelectedChange?.(null);
                      } else {
                        onSelectedChange?.(option);
                      }
                      setOpen(false);
                    }}
                    className="flex cursor-pointer items-center rounded px-2 py-1 data-[selected=true]:bg-gray-100"
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selected?.id === option.id ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
                {onCreate && options.length === 0 && (
                  <CommandItem
                    onSelect={() => {
                      onCreate(search || '');
                      setOpen(false);
                    }}
                    className="flex cursor-pointer items-center rounded px-2 py-1 data-[selected=true]:bg-gray-100"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {search
                      ? t('common.select.createWithValue', { value: search })
                      : t('common.select.createNewCategory')}
                  </CommandItem>
                )}
              </CommandGroup>
            </CommandList>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
