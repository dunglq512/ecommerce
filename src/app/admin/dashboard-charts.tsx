'use client'

import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface ChartData {
  name: string
  sales: number
  orders: number
}

export function DashboardCharts({ data }: { data: ChartData[] }) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-[400px] w-full bg-stone-50 animate-pulse rounded-[2rem]" />
  }

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1C1917" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#1C1917" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F5F4" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#A8A29E', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#A8A29E', fontSize: 12 }}
            tickFormatter={(value: number) => `${value / 1000000}M`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1C1917', 
              border: 'none', 
              borderRadius: '16px', 
              color: '#fff',
              fontSize: '12px',
              padding: '12px 16px'
            }}
            itemStyle={{ color: '#fff' }}
            cursor={{ stroke: '#E7E5E4', strokeWidth: 2 }}
          />
          <Area 
            type="monotone" 
            dataKey="sales" 
            stroke="#1C1917" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorSales)" 
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
