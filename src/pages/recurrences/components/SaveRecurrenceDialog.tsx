import { Controller, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/commons/Dialog';
import { Input } from '../../../components/commons/input/Input';
import { MoneyInput } from '../../../components/commons/input/MoneyInput';
import { NumericInput } from '../../../components/commons/input/NumericInput';
import { PeriodPickerInput } from '../../../components/commons/input/PeriodPickerInput';
import { AsyncSelectCategory } from '../../../components/AsyncSelectCategory';
import type { FCC } from '../../../utils/types';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '../../../components/commons/Form';
import { Button } from '../../../components/commons/Button';
import { Spinner } from '../../../components/commons/loader/Spinner';
import { parseUSD } from '../../../utils/functions';
import { Textarea } from '../../../components/commons/Textarea';

const schema = z
  .object({
    name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
    category: z.any().nullable().optional(),
    note: z.string().max(400, 'Note is too long').optional(),
    amount: z
      .string()
      .min(1, 'Amount is required')
      .refine((val) => parseUSD(val) > 0, 'Amount must be greater than 0'),
    day_of_month: z.string().refine((val) => {
      const parsed = parseInt(val, 10);
      return !isNaN(parsed) && parsed >= 1 && parsed <= 31;
    }, 'Day must be between 1 and 31'),
    start_period: z.string().min(6, 'Start Period is required'),
    end_period: z.string().optional().nullable(),
  })
  .refine(
    (data) => {
      if (!data.end_period) return true;
      return parseInt(data.end_period, 10) >= parseInt(data.start_period, 10);
    },
    {
      message: 'End period cannot be before start period',
      path: ['end_period'],
    },
  );

type FormType = z.infer<typeof schema>;

const initialDefaultValues: FormType = {
  name: '',
  category: null,
  note: '',
  amount: '',
  day_of_month: '',
  start_period: dayjs().format('YYYYMM'),
  end_period: null,
};

interface Props {
  defaultValues?: FormType;
  children?: React.ReactElement;
  isLoading?: boolean;
  onSave: (data: FormType, extras: { reset: () => void }) => void;
  isVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
}

export const SaveRecurrenceDialog: FCC<Props> = ({
  children,
  defaultValues = initialDefaultValues,
  isLoading = false,
  onSave,
  isVisible,
  onVisibleChange,
}) => {
  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
    reset,
  } = useForm({
    defaultValues,
    resolver: zodResolver(schema),
  });

  function onSubmit(data: FormType) {
    onSave(data, { reset });
  }

  return (
    <Dialog open={isVisible} onOpenChange={onVisibleChange}>
      {children && <DialogTrigger render={children} />}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{defaultValues.name ? 'Edit Recurrence' : 'Add Recurrence'}</DialogTitle>
        </DialogHeader>
        <Form
          onSubmit={(evt) => {
            evt.stopPropagation();
            handleSubmit(onSubmit)(evt);
          }}
          className="flex flex-col gap-3"
        >
          <label className="flex flex-col text-sm">
            <span data-error={errors.name?.message || '*'}>Name</span>
            <Input placeholder="Cinema ticket, Groceries..." {...register('name')} />
          </label>

          <label className="flex flex-col text-sm">
            <span>Category</span>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <AsyncSelectCategory selected={field.value} onChange={field.onChange} isCreatable />
              )}
            />
          </label>

          <label className="flex flex-col text-sm">
            <span data-error={errors.amount?.message || '*'}>Amount</span>
            <MoneyInput placeholder="0.00" {...register('amount')} />
          </label>

          <label className="flex flex-col text-sm">
            <span data-error={errors.day_of_month?.message || '*'}>Day of Month</span>
            <NumericInput
              placeholder="1 - 31"
              {...register('day_of_month')}
              maxLength={2}
              max={31}
            />
          </label>

          <div>
            <div className="flex w-full gap-2">
              <label className="flex w-full flex-col text-sm">
                <span data-error={errors.start_period?.message || '*'}>Start Period</span>
                <Controller
                  name="start_period"
                  control={control}
                  render={({ field }) => (
                    <PeriodPickerInput
                      value={
                        field.value
                          ? {
                              year: dayjs(field.value, 'YYYYMM').year(),
                              month: dayjs(field.value, 'YYYYMM').month(),
                            }
                          : undefined
                      }
                      onChange={(val) =>
                        field.onChange(dayjs().year(val.year).month(val.month).format('YYYYMM'))
                      }
                      placeholder="Start"
                    />
                  )}
                />
              </label>
              <label className="flex w-full flex-col text-sm">
                <span>End Period</span>
                <Controller
                  name="end_period"
                  control={control}
                  render={({ field }) => (
                    <PeriodPickerInput
                      value={
                        field.value
                          ? {
                              year: dayjs(field.value, 'YYYYMM').year(),
                              month: dayjs(field.value, 'YYYYMM').month(),
                            }
                          : undefined
                      }
                      onChange={(val) =>
                        field.onChange(dayjs().year(val.year).month(val.month).format('YYYYMM'))
                      }
                      placeholder="End"
                    />
                  )}
                />
              </label>
            </div>
            {errors.end_period?.message && (
              <span className="text-sm" data-error={errors.end_period?.message} />
            )}
          </div>

          <label className="flex flex-col text-sm">
            <span data-error={errors.note?.message}>Note</span>
            <Textarea className="min-h-28" placeholder="Note" {...register('note')} />
          </label>

          <div className="mt-4 flex w-full gap-2">
            <DialogClose
              render={
                <Button
                  type="button"
                  className="w-full"
                  variant="outlined"
                  disabled={isLoading}
                  onClick={() => reset()}
                />
              }
            >
              Cancel
            </DialogClose>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Spinner variant="secondary" /> : 'Save'}
            </Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
