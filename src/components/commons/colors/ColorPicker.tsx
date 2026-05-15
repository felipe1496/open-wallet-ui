import Chrome from '@uiw/react-color-chrome';
import { GithubPlacement } from '@uiw/react-color-github';
import { Popover, PopoverTrigger, PopoverContent } from '../Popover';
import type { FCC } from '../../../utils/types';

type Props = {
  color: string;
  onColorChange?: (color: string) => void;
  onOpenChange?: (open: boolean) => void;
};

export const ColorPicker: FCC<Props> = ({ color, children, onColorChange, onOpenChange }) => {
  return (
    <Popover onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="h-fit w-fit border-none p-0" side="top">
        <Chrome
          placement={GithubPlacement.Bottom}
          color={color}
          onChange={(newColor) => {
            onColorChange?.(newColor.hex);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};
