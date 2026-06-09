import { Controller, useForm, useWatch } from 'react-hook-form';
import { Button } from '../../../components/commons/Button';
import {
  Dialog,
  DialogClose,
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
import { NumericInput } from '../../../components/commons/input/NumericInput';
import { formatCurrency, parseUSD } from '../../../utils/functions';
import dayjs from 'dayjs';
import { AsyncSelectCategory } from '../../../components/AsyncSelectCategory';
import { type Category } from '../../../queries/categories-queries';
import type { Option } from '../../../components/commons/select/AsyncSelect';
import { Form } from '../../../components/commons/Form';
import { useState } from 'react';
import { Spinner } from '../../../components/commons/loader/Spinner';
import { useTranslation } from 'react-i18next';

interface Props {
  defaultValues?: Partial<Form>;
  previewDefaultValues?: PreviewForm;
  onSave: (data: Form & PreviewForm, { reset }: { reset: () => void }) => void;
  isVisible?: boolean;
  onClose?: () => void;
  isLoading?: boolean;
}

type Form = {
  name: string;
  amount: string;
  reference_date: string;
  installments: string;
  note?: string;
  category: Option<Category> | null;
};

const initialDefaultValues: Form = {
  name: '',
  amount: formatCurrency(0),
  installments: '2',
  reference_date: dayjs().format('YYYY-MM-DD'),
  note: '',
  category: null,
};

const STEPS = {
  FORM: 'FORM',
  PREVIEW: 'PREVIEW',
};

const previewSchema = z.object({
  entries: z.array(
    z.object({
      amount: z.string(),
      reference_date: z.string(),
    }),
  ),
});

type PreviewForm = z.infer<typeof previewSchema>;

const previewInitialDefaultValues: PreviewForm = {
  entries: [],
};

export const SaveInstallmentDialog: FCC<Props> = ({
  children,
  defaultValues = initialDefaultValues,
  previewDefaultValues = previewInitialDefaultValues,
  onSave,
  isVisible,
  onClose,
  isLoading = false,
}) => {
  const [step, setStep] = useState<(typeof STEPS)[keyof typeof STEPS]>(STEPS.FORM);
  const { t } = useTranslation();
  const schema = z.object({
    name: z
      .string()
      .min(1, t('common.form.validation.nameRequired'))
      .max(100, t('common.form.validation.nameTooLong')),
    amount: z.string(),
    reference_date: z.string(),
    installments: z
      .string()
      .refine(
        (installments) => Number(installments) % 1 === 0,
        t('common.form.validation.installmentsInteger'),
      ),
    note: z.string().max(400, t('common.form.validation.noteTooLong')).optional(),
    category: z.any(),
  });

  const formatPreviewPeriod = (referenceDate: string) => {
    const date = dayjs(referenceDate, 'YYYY-MM-DD');
    return `${t('dates.months.short', { returnObjects: true })[date.month()]} ${date.year()}`;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<Form>({
    defaultValues: { ...initialDefaultValues, ...defaultValues },
    resolver: zodResolver(schema),
  });

  const {
    register: previewRegister,
    handleSubmit: previewHandleSubmit,
    setValue,
    control: previewControl,
    reset: previewReset,
  } = useForm({
    defaultValues: previewDefaultValues,
    resolver: zodResolver(previewSchema),
  });

  const amount = useWatch({ control, name: 'amount' });
  const installments = useWatch({ control, name: 'installments' });
  const referenceDate = useWatch({ control, name: 'reference_date' });
  const preview = useWatch({ control: previewControl, name: 'entries' });

  function onSubmit() {
    const amountInCents = Math.round(parseUSD(amount) * 100);
    const amountPerPeriodInCents = Math.floor(amountInCents / Number(installments));
    const restInCents = amountInCents % Number(installments);

    const previewPeriodValue = Array.from({ length: Number(installments) }).map((_, idx) => {
      let amountInCents = amountPerPeriodInCents;
      if (idx === 0) {
        amountInCents += restInCents;
      }

      return {
        amount: formatCurrency(amountInCents / 100),
        reference_date: dayjs(referenceDate, 'YYYY-MM-DD').add(idx, 'month').format('YYYY-MM-DD'),
      };
    });
    setValue('entries', previewPeriodValue);
    setStep(STEPS.PREVIEW);
  }

  function onPreviewSubmit(data: PreviewForm) {
    onSave(
      {
        amount,
        category: control._formValues.category,
        reference_date: referenceDate,
        note: control._formValues.note,
        entries: data.entries,
        installments,
        name: control._formValues.name,
      },
      {
        reset: () => {
          reset();
          previewReset();
          setStep(STEPS.FORM);
        },
      },
    );
  }

  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {step === STEPS.FORM && t('wallet.transactionTypes.installment')}
            {step === STEPS.PREVIEW && t('wallet.installment.preview')}
          </DialogTitle>
        </DialogHeader>
        {step === STEPS.FORM && (
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex w-full flex-col gap-3">
              <label className="flex flex-col text-sm">
                <span data-error={errors.name?.message || '*'}>{t('common.form.fields.name')}</span>
                <Input
                  placeholder={t('common.form.placeholders.transactionName')}
                  {...register('name')}
                />
              </label>
              <label className="flex flex-col text-sm">
                <span data-error={errors.amount?.message || '*'}>
                  {t('common.form.fields.totalAmount')}
                </span>
                <MoneyInput {...register('amount')} minValue={0} maxValue={999999} />
              </label>
              <label className="flex flex-col text-sm">
                <span data-error={errors.installments?.message || '*'}>
                  {t('common.form.fields.installments')}
                </span>
                <NumericInput {...register('installments')} />
              </label>
              <label className="flex flex-col text-sm">
                <span data-error={errors.category?.message}>
                  {t('common.form.fields.category')}
                </span>
                <Controller
                  control={control}
                  name="category"
                  render={({ field: { onChange, value } }) => (
                    <AsyncSelectCategory onChange={onChange} selected={value} isCreatable />
                  )}
                />
              </label>
              <label className="flex flex-col text-sm">
                <span data-error={errors.reference_date?.message || '*'}>
                  {t('common.form.fields.date')}
                </span>
                <Input type="date" {...register('reference_date')} />
              </label>
              <label className="flex flex-col text-sm">
                <span data-error={errors.note?.message}>{t('common.form.fields.description')}</span>
                <Textarea className="min-h-28" {...register('note')} />
              </label>
            </div>

            <div className="flex w-full gap-2">
              <DialogClose asChild>
                <Button className="w-full" variant="outlined">
                  {t('common.actions.cancel')}
                </Button>
              </DialogClose>
              <Button className="w-full">{t('common.actions.next')}</Button>
            </div>
          </Form>
        )}
        {step === STEPS.PREVIEW && (
          <Form onSubmit={previewHandleSubmit(onPreviewSubmit)}>
            <div className="flex max-h-[450px] flex-col gap-1 overflow-y-scroll">
              {preview.map((preview, idx) => (
                <div className="flex items-center justify-between gap-4">
                  <span className="w-24 text-nowrap">
                    {formatPreviewPeriod(preview.reference_date)}
                  </span>
                  <MoneyInput className="w-full" {...previewRegister(`entries.${idx}.amount`)} />
                </div>
              ))}
            </div>
            <div className="flex w-full gap-2">
              <Button
                type="button"
                className="w-full"
                variant="outlined"
                onClick={() => setStep(STEPS.FORM)}
                disabled={isLoading}
              >
                {t('common.actions.back')}
              </Button>
              <Button className="w-full" disabled={isLoading}>
                {isLoading ? <Spinner variant="secondary" /> : t('common.actions.save')}
              </Button>
            </div>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};
