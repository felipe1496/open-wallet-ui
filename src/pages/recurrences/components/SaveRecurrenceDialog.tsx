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
import { useTranslation } from 'react-i18next';
import type { Option } from '../../../components/commons/select/AsyncSelect';
import type { Category } from '../../../queries/categories-queries';

type FormType = {
  name: string;
  category?: Option<Category> | null;
  note?: string;
  amount: string;
  day_of_month: string;
  start_period: string;
  end_period?: string | null;
};

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
  const { t } = useTranslation();
  const schema = z
    .object({
      name: z
        .string()
        .min(1, t('common.form.validation.nameRequired'))
        .max(100, t('common.form.validation.nameTooLong')),
      category: z.any().nullable().optional(),
      note: z.string().max(400, t('common.form.validation.noteTooLong')).optional(),
      amount: z
        .string()
        .min(1, t('common.form.validation.amountRequired'))
        .refine((val) => parseUSD(val) > 0, t('common.form.validation.amountGreaterThanZero')),
      day_of_month: z.string().refine((val) => {
        const parsed = parseInt(val, 10);
        return !isNaN(parsed) && parsed >= 1 && parsed <= 31;
      }, t('common.form.validation.dayBetweenOneAndThirtyOne')),
      start_period: z.string().min(6, t('common.form.validation.startPeriodRequired')),
      end_period: z.string().optional().nullable(),
    })
    .refine(
      (data) => {
        if (!data.end_period) return true;
        return parseInt(data.end_period, 10) >= parseInt(data.start_period, 10);
      },
      {
        message: t('common.form.validation.endPeriodBeforeStart'),
        path: ['end_period'],
      },
    );

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
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {defaultValues.name ? t('recurrences.editRecurrence') : t('recurrences.addRecurrence')}
          </DialogTitle>
        </DialogHeader>
        <Form
          onSubmit={(evt) => {
            evt.stopPropagation();
            handleSubmit(onSubmit)(evt);
          }}
          className="flex flex-col gap-3"
        >
          <label className="flex flex-col text-sm">
            <span data-error={errors.name?.message || '*'}>{t('common.form.fields.name')}</span>
            <Input
              placeholder={t('common.form.placeholders.transactionName')}
              {...register('name')}
            />
          </label>

          <label className="flex flex-col text-sm">
            <span>{t('common.form.fields.category')}</span>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <AsyncSelectCategory selected={field.value} onChange={field.onChange} isCreatable />
              )}
            />
          </label>

          <label className="flex flex-col text-sm">
            <span data-error={errors.amount?.message || '*'}>{t('common.form.fields.amount')}</span>
            <MoneyInput placeholder="0.00" {...register('amount')} />
          </label>

          <label className="flex flex-col text-sm">
            <span data-error={errors.day_of_month?.message || '*'}>
              {t('common.form.fields.dayOfMonth')}
            </span>
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
                <span data-error={errors.start_period?.message || '*'}>
                  {t('common.form.fields.startPeriod')}
                </span>
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
                      placeholder={t('common.form.placeholders.start')}
                    />
                  )}
                />
              </label>
              <label className="flex w-full flex-col text-sm">
                <span>{t('common.form.fields.endPeriod')}</span>
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
                      placeholder={t('common.form.placeholders.end')}
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
            <span data-error={errors.note?.message}>{t('common.form.fields.note')}</span>
            <Textarea
              className="min-h-28"
              placeholder={t('common.form.fields.note')}
              {...register('note')}
            />
          </label>

          <div className="mt-4 flex w-full gap-2">
            <DialogClose asChild>
              <Button
                type="button"
                className="w-full"
                variant="outlined"
                disabled={isLoading}
                onClick={() => reset()}
              >
                {t('common.actions.cancel')}
              </Button>
            </DialogClose>
            <Button className="w-full" disabled={isLoading}>
              {isLoading ? <Spinner variant="secondary" /> : t('common.actions.save')}
            </Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
