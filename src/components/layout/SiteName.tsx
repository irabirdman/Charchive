'use client';

import { useEffect, useState } from 'react';
import { getSiteConfigSync } from '@/lib/config/site-config-client';

export function SiteName() {
  const config = getSiteConfigSync();
  return <>{config.websiteName}</>;
}

