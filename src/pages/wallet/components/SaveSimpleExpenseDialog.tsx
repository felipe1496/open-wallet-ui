import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { Input } from '../../../components/commons/input/Input';
import {
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  Dialog,
  DialogHeader,
} from '../../../components/commons/Dialog';
import { Button } from '../../../components/commons/Button';
import { Textarea } from '../../../components/commons/Textarea';
import dayjs from 'dayjs';
import type { FCC } from '../../../utils/types';
import { MoneyInput } from '../../../components/commons/input/MoneyInput';
import { formatCurrency } from '../../../utils/functions';
import { Form } from '../../../components/commons/Form';
import { AsyncSelectCategory } from '../../../components/AsyncSelectCategory';
import { Spinner } from '../../../components/commons/loader/Spinner';
import { useTranslation } from 'react-i18next';
import type { Category } from '../../../queries/categories-queries';
import type { Option } from '../../../components/commons/select/AsyncSelect';

interface Props {
  defaultValues?: Partial<Form>;
  onSave: (data: Form, { reset }: { reset: () => void }) => void;
  isLoading?: boolean;
  isVisible?: boolean;
  onClose?: () => void;
}

const initialDefaultValues: Form = {
  name: '',
  amount: formatCurrency(0),
  date: dayjs().format('YYYY-MM-DD'),
  description: '',
  category: null,
};

type Form = {
  name: string;
  amount: string;
  date: string;
  description?: string;
  category: Option<Category> | null;
};

export const SaveSimpleExpenseDialog: FCC<Props> = ({
  defaultValues = initialDefaultValues,
  children,
  onSave,
  isLoading = false,
  isVisible,
  onClose,
}) => {
  const { t } = useTranslation();
  const schema = z.object({
    name: z
      .string()
      .min(1, t('common.form.validation.nameRequired'))
      .max(100, t('common.form.validation.nameTooLong')),
    amount: z.string(),
    date: z
      .string()
      .refine(
        (date) => dayjs(date, 'YYYY-MM-DD').isValid(),
        t('common.form.validation.invalidDate'),
      ),
    description: z.string().max(400, t('common.form.validation.descriptionTooLong')).optional(),
    category: z.any(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<Form>({
    defaultValues: { ...initialDefaultValues, ...defaultValues },
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: Form) => {
    onSave(data, { reset });
  };

  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('wallet.transactionTypes.expense')}</DialogTitle>
        </DialogHeader>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <label className="flex flex-col text-sm">
            <span data-error={errors.name?.message || '*'}>{t('common.form.fields.name')}</span>
            <Input
              placeholder={t('common.form.placeholders.transactionName')}
              {...register('name')}
            />
          </label>
          <label className="flex flex-col text-sm">
            <span data-error={errors.amount?.message || '*'}>{t('common.form.fields.amount')}</span>
            <MoneyInput {...register('amount')} minValue={0} maxValue={999999} />
          </label>
          <label className="flex flex-col text-sm">
            <span data-error={errors.category?.message}>{t('common.form.fields.category')}</span>
            <Controller
              control={control}
              name="category"
              render={({ field: { onChange, value } }) => (
                <AsyncSelectCategory onChange={onChange} selected={value} isCreatable />
              )}
            />
          </label>
          <label className="flex flex-col text-sm">
            <span data-error={errors.date?.message || '*'}>{t('common.form.fields.date')}</span>
            <Input type="date" {...register('date')} />
          </label>
          <label className="flex flex-col text-sm">
            <span data-error={errors.description?.message}>
              {t('common.form.fields.description')}
            </span>
            <Textarea className="min-h-28" {...register('description')} />
          </label>

          <div className="flex w-full gap-2">
            <DialogClose asChild>
              <Button className="w-full" variant="outlined" disabled={isLoading}>
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
