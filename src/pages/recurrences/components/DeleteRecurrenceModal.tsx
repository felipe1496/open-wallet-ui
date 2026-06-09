import type { FC } from 'react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../components/commons/Dialog';
import { Radio, RadioItem } from '../../../components/commons/Radio';
import { Button } from '../../../components/commons/Button';
import { Spinner } from '../../../components/commons/loader/Spinner';
import { useTranslation } from 'react-i18next';

interface DeleteRecurrenceModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (scope: 'all' | 'until_current') => void;
  isLoading?: boolean;
}

export const DeleteRecurrenceModal: FC<DeleteRecurrenceModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
  isLoading,
}) => {
  const [scope, setScope] = useState<'all' | 'until_current'>('all');
  const { t } = useTranslation();

  return (
    <Dialog open={isVisible} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('recurrences.delete.title')}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-6 p-6">
          <p className="text-zinc-600">{t('recurrences.delete.question')}</p>

          <Radio
            value={scope}
            onValueChange={(value) => setScope(value as 'all' | 'until_current')}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1">
              <RadioItem
                value="until_current"
                label={
                  <div className="flex flex-col">
                    <span className="font-medium">{t('recurrences.delete.keepHistory')}</span>
                    <span className="text-sm text-zinc-500">
                      {t('recurrences.delete.keepHistoryDescription')}
                    </span>
                  </div>
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <RadioItem
                value="all"
                label={
                  <div className="flex flex-col">
                    <span className="font-medium">{t('recurrences.delete.deleteAll')}</span>
                    <span className="text-sm text-zinc-500">
                      {t('recurrences.delete.deleteAllDescription')}
                    </span>
                  </div>
                }
              />
            </div>
          </Radio>

          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outlined" onClick={onClose} disabled={isLoading}>
              {t('common.actions.cancel')}
            </Button>
            <Button onClick={() => onConfirm(scope)} disabled={isLoading} variant="danger">
              {isLoading ? <Spinner variant="secondary" /> : t('common.actions.delete')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
