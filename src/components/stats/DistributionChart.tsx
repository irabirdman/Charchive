'use client';

import { BarChart } from './BarChart';

interface DistributionItem {
  label: string;
  count: number;
  percentage: number;
}

interface DistributionChartProps {
  title: string;
  items: DistributionItem[];
  color?: string;
  height?: number;
  limit?: number;
  horizontal?: boolean;
}

export function DistributionChart({ title, items, color = '#ec4899', height = 300, limit, horizontal = false }: DistributionChartProps) {
  const displayItems = limit ? items.slice(0, limit) : items;
  
  const chartData = displayItems.map(item => ({
    name: item.label || '(empty)',
    value: item.count,
    percentage: item.percentage,
  }));

  return (
    <BarChart 
      data={chartData} 
      dataKey="value" 
      color={color} 
      title={title}
      height={height}
      horizontal={horizontal}
    />
  );
}

