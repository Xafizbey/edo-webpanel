'use client';

import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#0B5FA5', '#1C7C54', '#D97706', '#DC2626', '#7C3AED', '#64748B'];

export function StatusChart({ data }: { data: { name: string; value: number }[] }) {
  if (data.length === 0) {
    return <div className="text-sm text-muted-foreground">Нет данных</div>;
  }

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={90} innerRadius={45}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
