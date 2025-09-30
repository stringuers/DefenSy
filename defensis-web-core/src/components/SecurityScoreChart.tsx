import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Shield, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const SecurityScoreChart = () => {
  const data = [
    { week: 'Week 1', score: 65, target: 85 },
    { week: 'Week 2', score: 70, target: 85 },
    { week: 'Week 3', score: 73, target: 85 },
    { week: 'Week 4', score: 78, target: 85 },
    { week: 'Week 5', score: 82, target: 85 },
    { week: 'Week 6', score: 85, target: 85 },
  ];

  const chartConfig = {
    score: {
      label: 'Security Score',
      color: 'hsl(var(--accent))',
    },
    target: {
      label: 'Target',
      color: 'hsl(var(--muted-foreground))',
    },
  };

  const currentScore = data[data.length - 1].score;
  const previousScore = data[data.length - 2].score;
  const improvement = currentScore - previousScore;

  const getScoreStatus = (score: number) => {
    if (score >= 90) return { label: 'Excellent', color: 'bg-success text-success' };
    if (score >= 80) return { label: 'Good', color: 'bg-info text-info' };
    if (score >= 70) return { label: 'Fair', color: 'bg-warning text-warning' };
    return { label: 'Needs Improvement', color: 'bg-critical text-critical' };
  };

  const status = getScoreStatus(currentScore);

  return (
    <Card className="gradient-card border-border/50 shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-accent" />
              Security Score Progress
            </CardTitle>
            <CardDescription>Weekly security score improvement</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-accent">{currentScore}</div>
            <Badge variant="outline" className={`${status.color} border-current/20 bg-current/10 mt-1`}>
              {status.label}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
            <XAxis 
              dataKey="week" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              domain={[0, 100]}
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="target"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="hsl(var(--accent))"
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--accent))', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4 text-success" />
            <span>+{improvement} points this week</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Target: <span className="font-medium text-foreground">85</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityScoreChart;
