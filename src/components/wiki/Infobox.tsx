import { ReactNode } from 'react';

interface InfoboxProps {
  children: ReactNode;
  className?: string;
  sticky?: boolean;
}

export function Infobox({ children, className = '', sticky = false }: InfoboxProps) {
  return (
    <aside
      className={`wiki-infobox ${sticky ? 'lg:sticky lg:top-24' : ''} ${className}`}
      suppressHydrationWarning
    >
      {children}
    </aside>
  );
}
