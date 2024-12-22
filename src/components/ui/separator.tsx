// components/ui/separator.tsx
import * as React from 'react';
import { Separator as RadixSeparator } from '@radix-ui/react-separator';

export const Separator = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof RadixSeparator>>(
  (props, ref) => {
    return (
      <RadixSeparator
        ref={ref}
        {...props}
        className="h-px bg-muted my-4"
      />
    );
  }
);

Separator.displayName = 'Separator';
