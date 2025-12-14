interface InfoRowProps {
  label: string;
  value: string | number | null | undefined;
  children?: React.ReactNode;
  icon?: string;
}

export function InfoRow({ label, value, children, icon }: InfoRowProps) {
  // Check if icon already has a color class, if not add default gray
  const iconClasses = icon 
    ? (icon.includes('text-') ? icon : `${icon} text-gray-400`)
    : '';
    
  return (
    <div className="flex flex-col sm:flex-row sm:items-start py-2.5 border-b border-gray-700/60 last:border-b-0 gap-1.5 sm:gap-2" suppressHydrationWarning>
      <dt className="font-semibold text-gray-200 sm:w-2/5 flex-shrink-0 flex items-center gap-2 text-sm leading-tight" suppressHydrationWarning>
        {icon && <i className={`${iconClasses} flex-shrink-0`} aria-hidden="true" suppressHydrationWarning></i>}
        <span className="break-words">{label}</span>
      </dt>
      <dd className="text-gray-50 sm:w-3/5 sm:pl-1 break-words text-sm leading-relaxed font-normal whitespace-pre-wrap" suppressHydrationWarning>
        {children || (value ?? '—')}
      </dd>
    </div>
  );
}
