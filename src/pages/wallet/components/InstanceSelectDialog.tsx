import { Dialog } from '@radix-ui/react-dialog';
import type { FC, ReactNode } from 'react';
import {
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../components/commons/Dialog';
import { Radio, RadioItem } from '../../../components/commons/Radio';
import { INSTANCE } from '../../../constants/ui';
import { Button } from '../../../components/commons/Button';

interface Props {
  title: ReactNode;
  isVisible: boolean;
  onClose: () => void;
  value: (typeof INSTANCE)[keyof typeof INSTANCE];
  onChange: (value: (typeof INSTANCE)[keyof typeof INSTANCE]) => void;
  onConfirm: () => void;
}

export const InstanceSelectDialog: FC<Props> = ({
  title,
  isVisible,
  onClose,
  onChange,
  value,
  onConfirm,
}) => {
  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogContent className="max-w-2xs">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form
          className="p-4"
          onSubmit={(evt) => {
            evt.preventDefault();
            onConfirm();
          }}
        >
          <Radio
            value={value}
            className="flex flex-col gap-2.5"
            defaultValue={INSTANCE.THIS_ONE}
            aria-label="Chose instances to edit"
            onValueChange={onChange}
          >
            {Object.values(INSTANCE).map((value, idx) => (
              <RadioItem key={`instance-select-${value}-${idx}`} label={value} value={value} />
            ))}
          </Radio>

          <div className="mt-4 flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outlined" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button>Confirm</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
