"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface DataItem {
  name: string;
  value: number;
  secondaryValue?: number;
}

interface DashboardBarChartProps {
  data: DataItem[];
  color?: string;
  secondaryColor?: string;
  height?: number;
  valuePrefix?: string;
  valueSuffix?: string;
}

export function DashboardBarChart({
  data,
  color = "#B45309",
  secondaryColor = "#CBD5E1",
  height = 260,
  valuePrefix = "",
  valueSuffix = "",
}: DashboardBarChartProps) {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBar data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "#64748B" }}
            axisLine={{ stroke: "#E2E8F0" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#64748B" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(val) => `${valuePrefix}${val > 999 ? `${(val / 1000).toFixed(0)}k` : val}${valueSuffix}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1E293B",
              borderRadius: "12px",
              border: "none",
              color: "#FFFFFF",
              fontSize: "12px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            }}
            formatter={(val: any) => [`${valuePrefix}${Number(val).toLocaleString()} ${valueSuffix}`, "Revenue"]}
          />
          <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} maxBarSize={38} />
          {data[0]?.secondaryValue !== undefined && (
            <Bar dataKey="secondaryValue" fill={secondaryColor} radius={[6, 6, 0, 0]} maxBarSize={38} />
          )}
        </RechartsBar>
      </ResponsiveContainer>
    </div>
  );
}

export default DashboardBarChart;

