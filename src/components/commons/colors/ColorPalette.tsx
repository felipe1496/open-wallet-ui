import { ColorPicker } from './ColorPicker';
import { ColorCircle } from './ColorCircle';
import type { FCC } from '../../../utils/types';
import { useState } from 'react';
import { CheckIcon, PlusIcon } from 'lucide-react';

interface Props {
  color: string;
  defaultColors?: string[];
  onChange: (color: string) => void;
}

export const ColorPalette: FCC<Props> = ({ color, defaultColors, onChange }) => {
  const idx = defaultColors?.findIndex((value) => value === color) ?? -1;
  const [selectedColorId, setSelectedColorId] = useState<string>(
    idx >= 0 ? `${color}-${idx}` : color ? 'CUSTOM' : '',
  );
  const [customColor, setCustomColor] = useState<string>(idx >= 0 ? '' : color);

  return (
    <div className="mt-2 flex items-center gap-1">
      {defaultColors?.map((value, idx) => {
        return (
          <ColorCircle
            key={`${value}-${idx}`}
            color={value}
            onClick={() => {
              onChange(value);
              setSelectedColorId(`${value}-${idx}`);
            }}
          >
            {selectedColorId === `${value}-${idx}` && <CheckIcon className="size-4 text-white" />}
          </ColorCircle>
        );
      })}

      <ColorPicker
        color={customColor}
        onColorChange={(newColor) => {
          setCustomColor(newColor);
          onChange(newColor);
        }}
        onOpenChange={(open: boolean) => {
          if (open) {
            setSelectedColorId('CUSTOM');
            return;
          }

          if (!customColor) {
            setSelectedColorId('');
          }
        }}
      >
        <ColorCircle color={customColor}>
          {selectedColorId === 'CUSTOM' ? (
            customColor ? (
              <CheckIcon className="size-4 text-white" />
            ) : (
              <CheckIcon className="text-muted-foreground size-4" />
            )
          ) : (
            <PlusIcon className="text-muted-foreground size-3" />
          )}
        </ColorCircle>
      </ColorPicker>
    </div>
  );
};
