import { Dialog } from '@radix-ui/react-dialog';
import type { FC } from 'react';
import { DialogContent, DialogHeader, DialogTitle } from './Dialog';
import { Button } from './Button';
import { useConfirm } from '../../hooks/useConfirm';
import { useTranslation } from 'react-i18next';

export const ConfirmDialog: FC = () => {
  const confirm = useConfirm();
  const { t } = useTranslation();

  return (
    <Dialog open={confirm.isVisible} onOpenChange={confirm.setIsVisible}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{confirm.title}</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p className="my-6 text-center">{confirm.description}</p>
          <div className="flex w-full justify-end gap-2">
            <Button variant="outlined" onClick={() => confirm.setIsVisible(false)}>
              {t('common.actions.cancel')}
            </Button>
            <Button
              onClick={() => {
                confirm.onConfirm();
                confirm.setIsVisible(false);
              }}
            >
              {t('common.actions.confirm')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
