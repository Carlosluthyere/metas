
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface StatsCardProps {
  completed: number;
  total: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ completed, total }) => {
  const data = [
    { name: 'Completas', value: completed },
    { name: 'Pendentes', value: Math.max(0, total - completed) },
  ];

  if (total === 0) data[1].value = 1; // Show empty state correctly

  const COLORS = ['#10b981', '#f1f5f9'];

  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between mb-6">
      <div className="flex-1">
        <h2 className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Progresso Diário</h2>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-slate-900">{percentage}%</span>
          <span className="text-sm text-slate-400 font-medium">concluído</span>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          {completed} de {total} metas finalizadas
        </p>
      </div>
      
      <div className="w-24 h-24 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={40}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              startAngle={90}
              endAngle={450}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
