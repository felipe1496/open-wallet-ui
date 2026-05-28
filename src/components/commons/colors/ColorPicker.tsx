import Chrome from '@uiw/react-color-chrome';
import { Popover, PopoverTrigger, PopoverContent, PopoverArrow } from '../Popover';
import type { FCC } from '../../../utils/types';
import { useMediaQuery } from '../../../hooks/useMediaQuery';

type Props = {
  color: string;
  children?: React.ReactElement;
  onColorChange?: (color: string) => void;
  onOpenChange?: (open: boolean) => void;
};

export const ColorPicker: FCC<Props> = ({ color, children, onColorChange, onOpenChange }) => {
  const horizontal = useMediaQuery('(max-height: 460px)');

  return (
    <Popover onOpenChange={onOpenChange}>
      <PopoverTrigger render={children} />
      <PopoverContent
        className="h-fit w-fit border-none p-0"
        align="center"
        side={horizontal ? 'top' : 'right'}
        sideOffset={8}
        collisionPadding={12}
        collisionAvoidance={{
          side: 'flip',
          align: 'flip',
          fallbackAxisSide: 'start',
        }}
      >
        <PopoverArrow className="size-3 rotate-45 border border-black/20 bg-white data-[side=bottom]:-top-1.5 data-[side=left]:-right-1.5 data-[side=right]:-left-1.5 data-[side=top]:-bottom-1.5" />
        <Chrome
          className={
            horizontal ? '!h-[120px] !w-[min(460px,100vw-24px)]' : '!w-[min(230px,100vw-24px)]'
          }
          style={{
            boxSizing: 'content-box',
            flexFlow: horizontal ? 'row nowrap' : 'column nowrap',
          }}
          showTriangle={false}
          color={color}
          onChange={(newColor) => {
            onColorChange?.(newColor.hex);
          }}
          horizontal={horizontal}
        />
      </PopoverContent>
    </Popover>
  );
};
