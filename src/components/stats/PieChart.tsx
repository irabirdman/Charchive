'use client';

import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface PieChartData {
  name: string;
  value: number;
}

interface PieChartProps {
  data: PieChartData[];
  colors?: string[];
  title?: string;
  height?: number;
  showLabels?: boolean;
}

const DEFAULT_COLORS = ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#14b8a6', '#f472b6'];

export function PieChart({ data, colors = DEFAULT_COLORS, title, height = 300, showLabels = true }: PieChartProps) {
  return (
    <div className="wiki-card p-4 md:p-6">
      {title && <h3 className="text-lg font-semibold text-gray-200 mb-4">{title}</h3>}
      <div className="w-full" style={{ minHeight: `${height}px` }}>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={showLabels ? ({ name, value, percent }) => {
                if (percent < 0.05) return '';
                return `${name}\n${value} (${(percent * 100).toFixed(0)}%)`;
              } : false}
              outerRadius={Math.min(height * 0.3, 100)}
              fill="#8884d8"
              dataKey="value"
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#f3f4f6',
                padding: '8px 12px'
              }}
              formatter={(value: number) => [value, 'Count']}
            />
            <Legend 
              wrapperStyle={{ color: '#9ca3af', fontSize: '14px' }}
              iconType="circle"
              layout="horizontal"
              verticalAlign="bottom"
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

