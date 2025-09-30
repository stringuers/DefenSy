import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Eye, 
  AlertTriangle, 
  Shield, 
  Activity, 
  Globe,
  Clock,
  TrendingUp,
  Zap,
  Settings,
  Bell,
  BarChart3
} from 'lucide-react';

const PostDeploySection = () => {
  const [selectedApp, setSelectedApp] = useState<string>('defensis-web');

  const applications = [
    {
      id: 'defensis-web',
      name: 'DefenSys Web App',
      url: 'https://defensis.com',
      status: 'healthy',
      uptime: '99.9%',
      lastDeploy: '2 hours ago',
      version: 'v2.1.4',
      threats: 0,
      alerts: 0
    },
    {
      id: 'api-service',
      name: 'API Service',
      url: 'https://api.defensis.com',
      status: 'warning',
      uptime: '98.2%',
      lastDeploy: '1 day ago',
      version: 'v1.8.2',
      threats: 2,
      alerts: 1
    },
    {
      id: 'mobile-api',
      name: 'Mobile API',
      url: 'https://mobile-api.defensis.com',
      status: 'healthy',
      uptime: '99.7%',
      lastDeploy: '3 days ago',
      version: 'v1.5.1',
      threats: 0,
      alerts: 0
    }
  ];

  const securityMetrics = [
    {
      name: 'Threats Blocked',
      value: '1,247',
      change: '+12%',
      trend: 'up',
      icon: <Shield className="h-4 w-4 text-success" />
    },
    {
      name: 'Active Alerts',
      value: '3',
      change: '-2',
      trend: 'down',
      icon: <AlertTriangle className="h-4 w-4 text-warning" />
    },
    {
      name: 'Response Time',
      value: '45ms',
      change: '-8ms',
      trend: 'up',
      icon: <Activity className="h-4 w-4 text-info" />
    },
    {
      name: 'Uptime',
      value: '99.9%',
      change: '+0.1%',
      trend: 'up',
      icon: <TrendingUp className="h-4 w-4 text-success" />
    }
  ];

  const recentThreats = [
    {
      id: '1',
      type: 'DDoS Attack',
      severity: 'high',
      source: '192.168.1.100',
      target: 'api.defensis.com',
      timestamp: '2 hours ago',
      status: 'blocked'
    },
    {
      id: '2',
      type: 'SQL Injection Attempt',
      severity: 'critical',
      source: '10.0.0.50',
      target: 'defensis.com/login',
      timestamp: '5 hours ago',
      status: 'blocked'
    },
    {
      id: '3',
      type: 'Suspicious Activity',
      severity: 'medium',
      source: '203.0.113.1',
      target: 'defensis.com/api',
      timestamp: '1 day ago',
      status: 'investigating'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'success';
      case 'warning': return 'warning';
      case 'critical': return 'critical';
      default: return 'muted';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'critical';
      case 'high': return 'high';
      case 'medium': return 'medium';
      case 'low': return 'low';
      default: return 'muted';
    }
  };

  const selectedAppData = applications.find(app => app.id === selectedApp);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Post-Deploy Monitoring</h2>
        <p className="text-muted-foreground">
          Monitor your deployed applications for security threats and performance issues
        </p>
      </div>

      {/* Application Selector */}
      <Card className="gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-accent" />
            Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {applications.map((app) => (
              <div
                key={app.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedApp === app.id
                    ? 'border-accent bg-accent/5'
                    : 'border-border hover:border-accent/50'
                }`}
                onClick={() => setSelectedApp(app.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{app.name}</h4>
                  <Badge 
                    variant="outline" 
                    className={`text-xs bg-${getStatusColor(app.status)}/10 border-${getStatusColor(app.status)}/20 text-${getStatusColor(app.status)}`}
                  >
                    {app.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Uptime:</span>
                    <span className="font-medium">{app.uptime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Version:</span>
                    <span className="font-medium">{app.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Threats:</span>
                    <span className={`font-medium ${app.threats > 0 ? 'text-warning' : 'text-success'}`}>
                      {app.threats}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {securityMetrics.map((metric, index) => (
          <Card key={index} className="gradient-card border-border/50 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.name}
              </CardTitle>
              <div className={metric.trend === 'up' ? 'text-success' : 'text-warning'}>
                {metric.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className={`text-xs ${metric.trend === 'up' ? 'text-success' : 'text-warning'}`}>
                {metric.change} from last week
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Application Details and Recent Threats */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Application Details */}
        <Card className="gradient-card border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-accent" />
              {selectedAppData?.name} Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">URL:</span>
                <span className="text-sm font-medium">{selectedAppData?.url}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge 
                  variant="outline" 
                  className={`text-xs bg-${getStatusColor(selectedAppData?.status || '')}/10 border-${getStatusColor(selectedAppData?.status || '')}/20 text-${getStatusColor(selectedAppData?.status || '')}`}
                >
                  {selectedAppData?.status?.toUpperCase()}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Uptime:</span>
                <span className="text-sm font-medium">{selectedAppData?.uptime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Last Deploy:</span>
                <span className="text-sm font-medium">{selectedAppData?.lastDeploy}</span>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Configure
                </Button>
                <Button size="sm" variant="outline">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analytics
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Threats */}
        <Card className="gradient-card border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Recent Security Threats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentThreats.map((threat) => (
                <div key={threat.id} className="p-3 border rounded-lg bg-secondary/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs bg-${getSeverityColor(threat.severity)}/10 border-${getSeverityColor(threat.severity)}/20 text-${getSeverityColor(threat.severity)}`}
                      >
                        {threat.severity.toUpperCase()}
                      </Badge>
                      <span className="text-sm font-medium">{threat.type}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {threat.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Source: {threat.source}</div>
                    <div>Target: {threat.target}</div>
                    <div>Time: {threat.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monitoring Controls */}
      <Card className="gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent" />
            Monitoring Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button className="w-full">
              <Eye className="mr-2 h-4 w-4" />
              Start Live Monitoring
            </Button>
            <Button variant="outline" className="w-full">
              <Bell className="mr-2 h-4 w-4" />
              Configure Alerts
            </Button>
            <Button variant="outline" className="w-full">
              <Settings className="mr-2 h-4 w-4" />
              Security Policies
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostDeploySection;
