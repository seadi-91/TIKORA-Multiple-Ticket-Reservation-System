"use client";

import React from "react";
import {
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

interface PieDataItem {
  name: string;
  value: number;
  color: string;
}

interface DashboardPieChartProps {
  data: PieDataItem[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
}

export function DashboardPieChart({
  data,
  height = 240,
  innerRadius = 55,
  outerRadius = 80,
}: DashboardPieChartProps) {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#1E293B",
              borderRadius: "12px",
              border: "none",
              color: "#FFFFFF",
              fontSize: "12px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            }}
            formatter={(val: any, name: any) => [`${val}%`, name]}
          />
          <Legend
            iconType="circle"
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }}
          />
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
        </RechartsPie>
      </ResponsiveContainer>
    </div>
  );
}

export default DashboardPieChart;

