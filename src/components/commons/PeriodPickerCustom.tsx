import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';
import { cn } from '../../utils/functions';
import { useState, type FC } from 'react';
import { MONTHS } from '../../constants/dates';

interface PeriodPickerCustomProps {
  value?: { month: number; year: number };
  onChange?: (value: { month: number; year: number }) => void;
  children: React.ReactNode;
  minYear?: number;
  maxYear?: number;
  align?: 'start' | 'center' | 'end';
}

export const PeriodPickerCustom: FC<PeriodPickerCustomProps> = ({
  value,
  onChange,
  children,
  minYear = 2000,
  maxYear = 2030,
  align = 'start',
}) => {
  const [open, setOpen] = useState(false);
  const [displayYear, setDisplayYear] = useState(value?.year || new Date().getFullYear());

  const handleMonthSelect = (monthIndex: number) => {
    onChange?.({ month: monthIndex, year: displayYear });
    setOpen(false);
  };

  const handlePreviousYear = () => {
    if (displayYear > minYear) {
      setDisplayYear(displayYear - 1);
    }
  };

  const handleNextYear = () => {
    if (displayYear < maxYear) {
      setDisplayYear(displayYear + 1);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-[280px] border border-zinc-300 bg-white p-0" align={align}>
        <div className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={handlePreviousYear}
              disabled={displayYear <= minYear}
              className={cn(
                'text-foreground flex h-8 w-8 cursor-pointer items-center justify-center rounded transition-colors',
                'hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50',
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-foreground text-sm font-semibold">{displayYear}</span>
            <button
              onClick={handleNextYear}
              disabled={displayYear >= maxYear}
              className={cn(
                'flex h-8 w-8 cursor-pointer items-center justify-center rounded transition-colors',
                'hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50',
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {MONTHS.map((month, index) => {
              const isSelected = value?.month === index && value?.year === displayYear;
              const isCurrentMonth =
                new Date().getMonth() === index && new Date().getFullYear() === displayYear;

              return (
                <button
                  key={month}
                  className={cn(
                    'h-10 cursor-pointer rounded text-sm font-medium transition-all',
                    isSelected
                      ? 'bg-primary text-white'
                      : 'text-foreground hover:bg-primary hover:text-white',
                    !isSelected && isCurrentMonth && 'border-primary/50 border',
                  )}
                  onClick={() => handleMonthSelect(index)}
                >
                  {month}
                </button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
