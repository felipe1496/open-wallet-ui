import { useForm } from 'react-hook-form';
import { Button } from '../../../components/commons/Button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '../../../components/commons/Dialog';
import { Input } from '../../../components/commons/input/Input';
import { Textarea } from '../../../components/commons/Textarea';
import type { FCC } from '../../../utils/types';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { MoneyInput } from '../../../components/commons/input/MoneyInput';
import { NumberInput } from '../../../components/commons/input/NumberInput';
import { useCtx } from '../../../hooks/useCtx';
import { formatCurrency } from '../../../utils/functions';
import dayjs from 'dayjs';

interface Props {
  defaultValues?: {
    name: string;
    amount: number;
    installments: number;
    date: string;
    description: string;
  };
  onSave: (data: Form) => void;
  isVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  isLoading?: boolean;
}

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  amount: z.string(),
  date: z.string(),
  installments: z
    .string()
    .refine((installments) => Number(installments) % 1 === 0, 'Installments must be an integer'),
  description: z.string().max(400, 'Description is too long').optional(),
});

type Form = z.infer<typeof schema>;

export const InstallmentDialog: FCC<Props> = ({
  children,
  defaultValues,
  onSave,
  isVisible,
  onVisibleChange,
  isLoading = false,
}) => {
  const { period } = useCtx();
  console.log(period.year, period.month, dayjs().day());
  const defaultValuesDefined = {
    name: defaultValues?.name || '',
    amount: defaultValues?.amount || 0,
    installments: defaultValues?.installments || 2,
    date:
      defaultValues?.date ||
      dayjs().year(period.year).month(period.month).date(dayjs().date()).format('YYYY-MM-DD'),
    description: defaultValues?.description || '',
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    defaultValues: {
      name: defaultValuesDefined.name,
      amount: formatCurrency(defaultValuesDefined.amount),
      installments: defaultValuesDefined.installments.toString(),
      date: defaultValuesDefined.date,
      description: defaultValuesDefined.description,
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: Form) => {
    onSave(data);
  };

  return (
    <Dialog open={isVisible} onOpenChange={onVisibleChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogTitle>Installment</DialogTitle>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex w-full flex-col gap-3">
            <label className="flex flex-col text-sm">
              <span data-error={errors.name?.message || '*'}>Name</span>
              <Input placeholder="Cinema ticket, Groceries..." {...register('name')} />
            </label>
            <label className="flex flex-col text-sm">
              <span data-error={errors.amount?.message || '*'}>Total Amount</span>
              <MoneyInput {...register('amount')} minValue={0} maxValue={999999} />
            </label>
            <label className="flex flex-col text-sm">
              <span data-error={errors.installments?.message || '*'}>Installments</span>
              <NumberInput {...register('installments')} />
            </label>
            <label className="flex flex-col text-sm">
              <span data-error={errors.date?.message || '*'}>Period</span>
              <Input type="date" {...register('date')} />
            </label>
            <label className="flex flex-col text-sm">
              <span data-error={errors.description?.message}>Description</span>
              <Textarea className="min-h-28" {...register('description')} />
            </label>
          </div>

          <div className="flex w-full gap-2">
            <Button variant="ghost" className="w-full">
              Cancel
            </Button>
            <Button className="w-full">{isLoading ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
