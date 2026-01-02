import { Controller, useForm } from 'react-hook-form';
import { Button } from '../../../components/commons/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
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
import { formatCurrency } from '../../../utils/functions';
import dayjs from 'dayjs';
import { AsyncSelectCategory } from '../../../components/AsyncSelectCategory';
import type { CategoriesService } from '../../../services/CategoriesService';
import type { Option } from '../../../components/commons/select/AsyncSelect';
import { Form } from '../../../components/commons/Form';

interface Props {
  defaultValues?: Form;
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
  category: z.any(),
});

type Form = Omit<z.infer<typeof schema>, 'category'> & {
  category: Option<
    Awaited<ReturnType<typeof CategoriesService.getCategories>>['data']['categories'][number]
  > | null;
};

const initialDefaultValues: Form = {
  name: '',
  amount: formatCurrency(0),
  installments: '2',
  date: dayjs().format('YYYY-MM-DD'),
  description: '',
  category: null,
};

export const AddInstallmentDialog: FCC<Props> = ({
  children,
  defaultValues = initialDefaultValues,
  onSave,
  isVisible,
  onVisibleChange,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<Form>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: Form) => {
    onSave(data);
    reset();
  };

  return (
    <Dialog open={isVisible} onOpenChange={onVisibleChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Installment</DialogTitle>
        </DialogHeader>
        <Form onSubmit={handleSubmit(onSubmit)}>
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
              <span data-error={errors.category?.message}>Category</span>
              <Controller
                control={control}
                name="category"
                render={({ field: { onChange, value } }) => (
                  <AsyncSelectCategory onChange={onChange} selected={value} />
                )}
              />
            </label>
            <label className="flex flex-col text-sm">
              <span data-error={errors.date?.message || '*'}>Date</span>
              <Input type="date" {...register('date')} />
            </label>
            <label className="flex flex-col text-sm">
              <span data-error={errors.description?.message}>Description</span>
              <Textarea className="min-h-28" {...register('description')} />
            </label>
          </div>

          <div className="flex w-full gap-2">
            <Button className="w-full" variant="outlined">
              Cancel
            </Button>
            <Button className="w-full">{isLoading ? 'Saving...' : 'Save'}</Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
