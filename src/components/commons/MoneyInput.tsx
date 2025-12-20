import type { ChangeEvent, FC, FocusEvent, InputHTMLAttributes } from 'react';
import { Input } from './Input';
import { formatCurrency } from '../../utils/functions';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  minValue?: number;
  maxValue?: number;
}

export const MoneyInput: FC<Props> = ({ minValue, maxValue, onInput, onBlur, ...props }) => {
  function handleOnInput(event: ChangeEvent<HTMLInputElement>) {
    if ((minValue && minValue < 0) || (maxValue && maxValue < 0)) {
      throw new Error('MoneyInput only supports positive values for minValue and maxValue');
    }
    const onlyNumbers = event.target.value.replace(/\D/g, '');
    const cents = parseInt(onlyNumbers || '0', 10);
    const amount = cents / 100;
    event.target.value = formatCurrency(amount);

    if (onInput) onInput(event);
  }

  function handleOnBlur(event: FocusEvent<HTMLInputElement>) {
    const onlyNumbers = event.target.value.replace(/\D/g, '');
    const cents = parseInt(onlyNumbers || '0', 10);
    const amount = cents / 100;
    if (minValue !== undefined && amount < minValue) {
      event.target.value = formatCurrency(minValue);
    } else if (maxValue !== undefined && amount > maxValue) {
      event.target.value = formatCurrency(maxValue);
    }

    if (onBlur) {
      onBlur(event);
    }
  }

  return <Input {...props} inputMode="numeric" onInput={handleOnInput} onBlur={handleOnBlur} />;
};
