'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface AdminLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
}

export function AdminLink({ href, className, children }: AdminLinkProps) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
