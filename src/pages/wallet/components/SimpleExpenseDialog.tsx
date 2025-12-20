import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { Input } from '../../../components/commons/Input';
import { Dialog } from '@radix-ui/react-dialog';
import { DialogClose, DialogContent, DialogTrigger } from '../../../components/commons/Dialog';
import { Button } from '../../../components/commons/Button';
import { Textarea } from '../../../components/commons/Textarea';
import dayjs from 'dayjs';
import type { FCC } from '../../../utils/types';
import { MoneyInput } from '../../../components/commons/MoneyInput';
import { formatCurrency } from '../../../utils/functions';

interface Props {
  defaultValues?: Form;
  onSave: (data: Form) => void;
  isLoading?: boolean;
  isVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
}

const initialDefaultValues = {
  name: '',
  amount: `${formatCurrency(0)}`,
  date: new Date(),
  description: '',
};

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  amount: z.string(),
  date: z.string().refine((date) => dayjs(date, 'YYYY-MM-DD').isValid(), 'Invalid date'),
  description: z.string().max(400, 'Description is too long').optional(),
});

type Form = z.infer<typeof schema>;

export const SimpleExpenseDialog: FCC<Props> = ({
  defaultValues = initialDefaultValues,
  children,
  onSave,
  isLoading = false,
  isVisible,
  onVisibleChange,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    defaultValues: {
      name: defaultValues.name,
      amount: defaultValues.amount.toString(),
      date: dayjs(defaultValues.date).format('YYYY-MM-DD'),
      description: defaultValues.description,
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
        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
          <label className="flex flex-col text-sm">
            <span data-error={errors.name?.message || '*'}>Name</span>
            <Input placeholder="Cinema ticket, Groceries..." {...register('name')} />
          </label>
          <label className="flex flex-col text-sm">
            <span data-error={errors.amount?.message || '*'}>Amount</span>
            <MoneyInput {...register('amount')} minValue={0} maxValue={999999} />
          </label>
          <label className="flex flex-col text-sm">
            <span data-error={errors.date?.message || '*'}>Date</span>
            <Input type="date" {...register('date')} />
          </label>
          <label className="flex flex-col text-sm">
            <span data-error={errors.description?.message}>Description</span>
            <Textarea className="min-h-28" {...register('description')} />
          </label>

          <div className="flex w-full gap-2">
            <DialogClose asChild>
              <Button className="w-full" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <Button className="w-full">{isLoading ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
