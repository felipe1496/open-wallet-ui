import { Radio as PrimitiveRadio } from '@base-ui/react/radio';
import { RadioGroup as PrimitiveRadioGroup } from '@base-ui/react/radio-group';
import type { FC, ReactNode } from 'react';

export const Radio = PrimitiveRadioGroup;

interface RadioItemProps {
  label: ReactNode;
  value: string;
}

export const RadioItem: FC<RadioItemProps> = ({ label, value }) => {
  return (
    <label className="flex cursor-pointer items-center">
      <PrimitiveRadio.Root
        className="size-6 cursor-pointer rounded-full border border-zinc-300 bg-white shadow outline-none"
        value={value}
      >
        <PrimitiveRadio.Indicator className="after:bg-primary relative flex size-full items-center justify-center after:block after:size-3 after:rounded-full" />
      </PrimitiveRadio.Root>
      <span className="pl-2 text-[15px] leading-none">{label}</span>
    </label>
  );
};
export const RadioIndicator = PrimitiveRadio.Indicator;
