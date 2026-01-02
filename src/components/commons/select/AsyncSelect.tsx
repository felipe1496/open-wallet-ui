import { Check, ChevronsUpDown, LoaderCircleIcon, Search, XIcon } from 'lucide-react';
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
}

export function AsyncSelect<T>({
  options,
  selected,
  onSelectedChange,
  placeholder = 'Select an option...',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No results.',
  className,
  disabled = false,
  isLoading = false,
  onSearchChange = () => {},
  search,
}: Props<T>) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            'flex h-10 w-full cursor-pointer items-center justify-between rounded-md border border-zinc-300 px-2 text-sm disabled:cursor-not-allowed',
            !selected && 'text-muted-foreground',
            className,
          )}
        >
          {selected ? selected.label : placeholder}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(evt) => {
                evt.stopPropagation();
                onSelectedChange?.(null);
              }}
              className="cursor-pointer"
            >
              <XIcon className="size-4 text-zinc-400" />
            </button>

            <div className="h-5 w-px bg-zinc-300" />

            {isLoading ? (
              <LoaderCircleIcon className="text-muted-foreground size-4 animate-spin" />
            ) : (
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            )}
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <div className="flex items-center border-b border-zinc-300 px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              placeholder={searchPlaceholder}
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
                {emptyMessage}
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
              </CommandGroup>
            </CommandList>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
