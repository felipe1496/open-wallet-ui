import { Controller, useForm } from 'react-hook-form';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/commons/Dialog';
import { Input } from '../../../components/commons/input/Input';
import type { FCC } from '../../../utils/types';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '../../../components/commons/Form';
import { Button } from '../../../components/commons/Button';
import { Spinner } from '../../../components/commons/loader/Spinner';
import { ColorPalette } from '../../../components/commons/colors/ColorPalette';

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name is too long'),
  color: z.string().min(1, 'Color is required'),
});

type Form = z.infer<typeof schema>;

const initialDeafultValues: Form = {
  name: '',
  color: '',
};

interface Props {
  defaultValues?: Form;
  isLoading?: boolean;
  onSave: (data: Form, { reset }: { reset: () => void }) => void;
  isVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
}

export const SaveCategoryDialog: FCC<Props> = ({
  children,
  defaultValues = initialDeafultValues,
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

  function onSubmit(data: Form) {
    onSave(data, { reset });
  }

  const DEFAULT_COLORS = [
    '#fb2c36',
    '#ff6900',
    '#efb100',
    '#7ccf00',
    '#00c951',
    '#00bba7',
    '#2b7fff',
    '#ad46ff',
    '#ec4899',
    '#f43f5e',
  ];

  return (
    <Dialog open={isVisible} onOpenChange={onVisibleChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
        </DialogHeader>
        <Form
          onSubmit={(evt) => {
            evt.stopPropagation();
            handleSubmit(onSubmit)(evt);
          }}
        >
          <label className="flex flex-col text-sm">
            <span data-error={errors.name?.message}>Name</span>
            <Input placeholder="Name" {...register('name')} />
          </label>
          <label className="pointer-events-none flex flex-col text-sm">
            <span data-error={errors.color?.message}>Color</span>
            <Controller
              name="color"
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <ColorPalette
                    color={value || ''}
                    defaultColors={DEFAULT_COLORS}
                    onChange={onChange}
                  />
                );
              }}
            />
          </label>

          <div className="flex w-full gap-2">
            <DialogClose asChild>
              <Button className="w-full" variant="outlined" disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
            <Button className="w-full" disabled={isLoading}>
              {isLoading ? <Spinner variant="secondary" /> : 'Save'}
            </Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
