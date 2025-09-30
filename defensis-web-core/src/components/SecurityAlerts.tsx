import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Shield, 
  Clock, 
  CheckCircle2,
  Bell,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { getSecurityAlerts } from '@/lib/api';

const SecurityAlerts = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await getSecurityAlerts();
        setAlerts(data);
      } catch (error) {
        console.error('Failed to fetch security alerts:', error);
        // Use empty array if API fails
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'critical';
      case 'high': return 'high';
      case 'medium': return 'medium';
      case 'low': return 'low';
      default: return 'muted';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'critical';
      case 'acknowledged': return 'warning';
      case 'in-progress': return 'info';
      case 'resolved': return 'success';
      default: return 'muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <AlertTriangle className="h-4 w-4 text-critical" />;
      case 'acknowledged': return <Clock className="h-4 w-4 text-warning" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-info" />;
      case 'resolved': return <CheckCircle2 className="h-4 w-4 text-success" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Critical Vulnerability': return <AlertTriangle className="h-4 w-4 text-critical" />;
      case 'Dependency Alert': return <Shield className="h-4 w-4 text-warning" />;
      case 'Security Policy': return <Shield className="h-4 w-4 text-info" />;
      case 'Code Quality': return <CheckCircle2 className="h-4 w-4 text-medium" />;
      default: return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card className="gradient-card border-border/50 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-accent" />
          Security Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="p-3 border rounded-lg bg-secondary/50">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getTypeIcon(alert.type)}
                  <Badge 
                    variant="outline" 
                    className={`text-xs bg-${getSeverityColor(alert.severity)}/10 border-${getSeverityColor(alert.severity)}/20 text-${getSeverityColor(alert.severity)}`}
                  >
                    {alert.severity.toUpperCase()}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`text-xs bg-${getStatusColor(alert.status)}/10 border-${getStatusColor(alert.status)}/20 text-${getStatusColor(alert.status)}`}
                  >
                    {alert.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  {getStatusIcon(alert.status)}
                </div>
              </div>
              
              <h4 className="font-medium text-sm mb-1">{alert.title}</h4>
              <p className="text-xs text-muted-foreground mb-2">{alert.description}</p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span>{alert.repository}</span>
                  <span>•</span>
                  <span>{alert.file}</span>
                </div>
                <span>{alert.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              <Bell className="mr-2 h-4 w-4" />
              Configure Alerts
            </Button>
            <Button variant="outline" className="flex-1">
              <ExternalLink className="mr-2 h-4 w-4" />
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityAlerts;
