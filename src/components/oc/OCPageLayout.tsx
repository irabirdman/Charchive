import { ReactNode } from 'react';
import type { OC } from '@/types/oc';
import { applyWorldThemeStyles } from '@/lib/theme/worldTheme';

interface OCPageLayoutProps {
  oc: OC;
  children: ReactNode;
}

export function OCPageLayout({ oc, children }: OCPageLayoutProps) {
  const themeStyles = applyWorldThemeStyles(oc.world);

  return (
    <div style={themeStyles} suppressHydrationWarning>
      {children}
    </div>
  );
}
