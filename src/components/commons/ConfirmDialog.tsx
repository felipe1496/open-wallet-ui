import { Dialog } from '@radix-ui/react-dialog';
import type { FC } from 'react';
import { DialogContent, DialogTitle } from './Dialog';
import { Button } from './Button';
import { useConfirmStore } from '../../stores/useConfirmStore';

export const ConfirmDialog: FC = () => {
  const confirm = useConfirmStore();

  return (
    <Dialog open={confirm.isVisible} onOpenChange={confirm.setIsVisible}>
      <DialogContent>
        <DialogTitle>{confirm.title}</DialogTitle>
        <p className="my-6 text-center">{confirm.description}</p>
        <div className="flex w-full justify-end gap-2">
          <Button variant="outlined" onClick={() => confirm.setIsVisible(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              confirm.onConfirm();
              confirm.setIsVisible(false);
            }}
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
