import { useRef, type ButtonHTMLAttributes, type ChangeEvent, type MouseEvent } from 'react';
import { Slot } from '@radix-ui/react-slot';
import type { FCC } from '../../utils/types';

interface AsChild {
  asChild: true;
}

interface NotAsChild extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: false;
}

type Union = AsChild | NotAsChild;

type Props = Union & {
  onColorChange?: (color: string) => void;
};

export const ColorPicker: FCC<Props> = ({ asChild = false, children, onColorChange, ...props }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  function openPicker(evt: MouseEvent<HTMLButtonElement>) {
    inputRef.current?.click();
    if ('onClick' in props && props.onClick) {
      props.onClick(evt);
    }
  }

  function handleChange(evt: ChangeEvent<HTMLInputElement>) {
    onColorChange?.(evt.target.value);
  }

  const Comp = asChild ? Slot : 'button';

  return (
    <>
      <input ref={inputRef} type="color" className="hidden" onChange={handleChange} />
      <Comp onClick={openPicker} type={asChild ? undefined : 'button'} {...props}>
        {children}
      </Comp>
    </>
  );
};
