"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface DataItem {
  name: string;
  value: number;
}

interface DashboardLineChartProps {
  data: DataItem[];
  color?: string;
  height?: number;
  valuePrefix?: string;
  valueSuffix?: string;
}

export function DashboardLineChart({
  data,
  color = "#B45309",
  height = 260,
  valuePrefix = "",
  valueSuffix = "",
}: DashboardLineChartProps) {
  const gradientId = `grad-${color.replace("#", "")}`;

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.25} />
              <stop offset="95%" stopColor={color} stopOpacity={0.0} />
            </linearGradient>
          </defs>
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
            formatter={(val: any) => [`${valuePrefix}${Number(val).toLocaleString()} ${valueSuffix}`, "Sales"]}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2.5}
            fillOpacity={1}
            fill={`url(#${gradientId})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DashboardLineChart;

