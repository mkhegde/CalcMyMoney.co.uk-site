import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';

const DEFAULT_COLOURS = ['#1d4ed8', '#0ea5e9', '#0369a1', '#22d3ee', '#bae6fd'];

const formatCurrency = (value) =>
  `£${Number(value || 0).toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function ResultBreakdownChart({ data = [], title }) {
  const chartData = Array.isArray(data)
    ? data
        .filter((item) => Number(item?.value) > 0)
        .map((item, index) => ({
          name: item.name,
          value: Number(item.value),
          fill: item.color || DEFAULT_COLOURS[index % DEFAULT_COLOURS.length],
        }))
    : [];

  if (!chartData.length) {
    return null;
  }

  return (
    <div className="w-full h-64" role="img" aria-label={title || 'Result breakdown chart'}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius="55%"
            outerRadius="90%"
            paddingAngle={2}
          >
            {chartData.map((entry, index) => (
              <Cell key={`${entry.name}-${index}`} fill={entry.fill} stroke="#0f172a" strokeWidth={1} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => formatCurrency(value)}
            contentStyle={{
              background: 'rgba(15,23,42,0.92)',
              borderRadius: '0.5rem',
              border: 'none',
              color: '#f8fafc',
            }}
            itemStyle={{ color: '#f8fafc' }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

