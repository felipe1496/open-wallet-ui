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
import { DEFAULT_COLORS } from '../../../constants/default-colors';
import { cn } from '../../../utils/functions';
import { CheckIcon, PlusIcon } from 'lucide-react';
import { ColorPicker } from '../../../components/commons/ColorPicker';
import { Button } from '../../../components/commons/Button';

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
  onSave: (data: Form) => void;
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
    onSave(data);
    reset();
  }

  return (
    <Dialog open={isVisible} onOpenChange={onVisibleChange}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
        </DialogHeader>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <label className="flex flex-col text-sm">
            <span data-error={errors.name?.message}>Name</span>
            <Input placeholder="Name" {...register('name')} />
          </label>
          <label className="flex flex-col text-sm">
            <span data-error={errors.color?.message}>Color</span>
            <Controller
              name="color"
              control={control}
              render={({ field: { onChange, value } }) => {
                const isCustomColor = value && !Object.values(DEFAULT_COLORS).includes(value);
                return (
                  <div className="mt-2 flex items-center gap-1">
                    {Object.values(DEFAULT_COLORS).map((color) => (
                      <button
                        type="button"
                        onClick={() => onChange(color)}
                        className="flex size-6 cursor-pointer items-center justify-center rounded-full"
                        style={{ backgroundColor: color }}
                      >
                        {value === color && <CheckIcon className="size-4 text-white" />}
                      </button>
                    ))}
                    <ColorPicker
                      onColorChange={onChange}
                      className={cn(
                        isCustomColor
                          ? 'flex size-6 cursor-pointer items-center justify-center rounded-full'
                          : 'border-muted-foreground flex size-5 cursor-pointer items-center justify-center rounded-full border border-dashed',
                      )}
                      style={{
                        backgroundColor: isCustomColor ? value : 'transparent',
                      }}
                    >
                      {isCustomColor ? (
                        <CheckIcon className="size-4 text-white" />
                      ) : (
                        <PlusIcon className="text-muted-foreground size-3" />
                      )}
                    </ColorPicker>
                  </div>
                );
              }}
            />
          </label>

          <div className="flex w-full gap-2">
            <DialogClose asChild>
              <Button className="w-full" variant="outlined">
                Cancel
              </Button>
            </DialogClose>
            <Button className="w-full">{isLoading ? 'Saving...' : 'Save'}</Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
