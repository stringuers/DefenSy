import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Activity, CheckCircle2, XCircle } from 'lucide-react';

const ScanActivityChart = () => {
  const data = [
    { day: 'Mon', successful: 12, failed: 2, total: 14 },
    { day: 'Tue', successful: 15, failed: 1, total: 16 },
    { day: 'Wed', successful: 18, failed: 3, total: 21 },
    { day: 'Thu', successful: 14, failed: 1, total: 15 },
    { day: 'Fri', successful: 20, failed: 2, total: 22 },
    { day: 'Sat', successful: 8, failed: 0, total: 8 },
    { day: 'Sun', successful: 6, failed: 1, total: 7 },
  ];

  const chartConfig = {
    successful: {
      label: 'Successful',
      color: 'hsl(var(--success))',
    },
    failed: {
      label: 'Failed',
      color: 'hsl(var(--critical))',
    },
  };

  const totalScans = data.reduce((acc, day) => acc + day.total, 0);
  const totalSuccessful = data.reduce((acc, day) => acc + day.successful, 0);
  const successRate = ((totalSuccessful / totalScans) * 100).toFixed(1);

  return (
    <Card className="gradient-card border-border/50 shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-info" />
              Scan Activity
            </CardTitle>
            <CardDescription>Daily scan statistics for the past week</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-foreground">{totalScans}</div>
            <div className="text-xs text-muted-foreground">Total Scans</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
            <XAxis 
              dataKey="day" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar 
              dataKey="successful" 
              fill="hsl(var(--success))" 
              radius={[4, 4, 0, 0]}
              stackId="a"
            />
            <Bar 
              dataKey="failed" 
              fill="hsl(var(--critical))" 
              radius={[4, 4, 0, 0]}
              stackId="a"
            />
          </BarChart>
        </ChartContainer>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span className="text-sm text-muted-foreground">
                {totalSuccessful} Successful
              </span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-critical" />
              <span className="text-sm text-muted-foreground">
                {totalScans - totalSuccessful} Failed
              </span>
            </div>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Success Rate: </span>
            <span className="font-medium text-success">{successRate}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScanActivityChart;
