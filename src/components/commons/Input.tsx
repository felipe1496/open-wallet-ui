import type { ChangeEvent, FC, InputHTMLAttributes } from 'react';
import { cn, sanitizeNumericOnBlur, sanitizeNumericOnInput } from '../../utils/functions';

interface NumericInput extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  type: 'number';
  minNumber?: number;
  maxNumber?: number;
  decimalPrecision?: number;
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  minNumber?: never;
  maxNumber?: never;
  decimalPrecision?: never;
}

type Props = NumericInput | InputProps;

export const Input: FC<Props> = ({
  className,
  type = 'text',
  decimalPrecision,
  minNumber,
  maxNumber,
  onInput,
  onBlur,
  ...props
}) => {
  const isNumericMode = type === 'number';
  const handleOnInput = (evt: ChangeEvent<HTMLInputElement>) => {
    const el = evt.target;
    switch (type) {
      case 'number': {
        const newValue = sanitizeNumericOnInput(el.value, decimalPrecision, minNumber, maxNumber);
        el.value = newValue;
        break;
      }
      default:
        break;
    }
    if (onInput) onInput(evt);
  };

  const handleOnBlur = (evt: ChangeEvent<HTMLInputElement>) => {
    const el = evt.target;

    switch (type) {
      case 'number': {
        const newValue = sanitizeNumericOnBlur(
          el.value,
          decimalPrecision,
          minNumber as number,
          maxNumber as number,
        );
        el.value = newValue;
        break;
      }
      default:
        break;
    }
  };

  return (
    <input
      className={cn(
        'h-10 rounded-md border border-zinc-600 px-2 text-sm placeholder:text-zinc-600',
        className,
      )}
      onInput={isNumericMode ? handleOnInput : onInput}
      inputMode={isNumericMode ? 'decimal' : undefined}
      onBlur={isNumericMode ? handleOnBlur : onBlur}
      type={isNumericMode ? 'text' : type}
      {...props}
    />
  );
};
