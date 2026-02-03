
import React from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from 'recharts';

interface TrendChartProps {
  data: number[];
  color?: string;
}

export const TrendChart: React.FC<TrendChartProps> = ({ data, color = '#6366f1' }) => {
  const chartData = data.map((val, i) => ({ val, index: i }));

  return (
    <div className="h-16 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="val"
            stroke={color}
            strokeWidth={2}
            dot={false}
            animationDuration={1500}
          />
          <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
          <Tooltip 
            contentStyle={{ fontSize: '10px', padding: '4px' }}
            itemStyle={{ color: color }}
            labelStyle={{ display: 'none' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
