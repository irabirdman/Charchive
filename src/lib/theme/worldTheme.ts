import type { World } from '@/types/oc';

export function getWorldTheme(world: World | null | undefined) {
  if (!world) {
    return {
      primary: '#64748b',
      accent: '#94a3b8',
    };
  }

  return {
    primary: world.primary_color || '#64748b',
    accent: world.accent_color || '#94a3b8',
  };
}

export function applyWorldThemeStyles(world: World | null | undefined) {
  const theme = getWorldTheme(world);
  return {
    '--world-primary': theme.primary,
    '--world-accent': theme.accent,
  } as React.CSSProperties;
}
