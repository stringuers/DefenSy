import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Eye,
  GitBranch,
  Zap
} from 'lucide-react';
import { getDashboardStats } from '@/lib/api';

const DashboardStats = () => {
  const [apiStats, setApiStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setApiStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    {
      title: 'Security Score',
      value: apiStats?.security_score?.toString() || '0',
      max: '100',
      icon: <Shield className="h-5 w-5 text-accent" />,
      trend: '+5',
      trendLabel: 'from last week',
      color: 'accent'
    },
    {
      title: 'Active Scans',
      value: apiStats?.total_scans?.toString() || '0',
      icon: <Eye className="h-5 w-5 text-info" />,
      subtitle: 'Total security scans',
      color: 'info'
    },
    {
      title: 'Vulnerabilities',
      value: apiStats?.vulnerabilities?.toString() || '0',
      icon: <AlertTriangle className="h-5 w-5 text-critical" />,
      subtitle: 'Security issues found',
      color: 'critical'
    },
    {
      title: 'Issues Resolved',
      value: '0',
      icon: <CheckCircle2 className="h-5 w-5 text-success" />,
      trend: '+0',
      trendLabel: 'this week',
      color: 'success'
    },
    {
      title: 'Last Scan',
      value: loading ? '...' : 'Never',
      icon: <Clock className="h-5 w-5 text-muted-foreground" />,
      subtitle: 'Start your first scan',
      color: 'muted'
    },
    {
      title: 'Repositories',
      value: apiStats?.repositories?.toString() || '0',
      icon: <GitBranch className="h-5 w-5 text-warning" />,
      subtitle: 'Connected repositories',
      color: 'warning'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'accent':
        return 'text-accent';
      case 'info':
        return 'text-info';
      case 'critical':
        return 'text-critical';
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => (
        <Card key={index} className="gradient-card border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={getColorClasses(stat.color)}>
              {stat.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline space-x-2">
                <span className={`text-2xl font-bold ${getColorClasses(stat.color)}`}>
                  {stat.value}
                </span>
                {stat.max && (
                  <span className="text-sm text-muted-foreground">
                    /{stat.max}
                  </span>
                )}
                {stat.trend && (
                  <div className="flex items-center space-x-1 text-xs text-success">
                    <TrendingUp className="h-3 w-3" />
                    <span>{stat.trend}</span>
                  </div>
                )}
              </div>
              
              {stat.subtitle && (
                <p className="text-xs text-muted-foreground">
                  {stat.subtitle}
                </p>
              )}
              
              {stat.trendLabel && (
                <p className="text-xs text-muted-foreground">
                  {stat.trendLabel}
                </p>
              )}

              {stat.title === 'Security Score' && (
                <div className="mt-2">
                  <Progress value={apiStats?.security_score || 0} className="h-2" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
