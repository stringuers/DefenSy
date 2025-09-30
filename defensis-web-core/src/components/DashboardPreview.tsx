import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  Shield, 
  TrendingUp, 
  Clock, 
  GitBranch, 
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";

const DashboardPreview = () => {
  const vulnerabilities = [
    { 
      id: 1, 
      title: "SQL Injection in user authentication", 
      severity: "critical", 
      status: "open",
      file: "auth.py:45"
    },
    { 
      id: 2, 
      title: "Insecure dependency: lodash@4.17.20", 
      severity: "high", 
      status: "fixed",
      file: "package.json"
    },
    { 
      id: 3, 
      title: "Missing CSRF protection", 
      severity: "medium", 
      status: "in-progress",
      file: "forms.py:12"
    },
    { 
      id: 4, 
      title: "Weak password policy", 
      severity: "low", 
      status: "open",
      file: "config.py:28"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'critical';
      case 'high': return 'high';
      case 'medium': return 'medium';
      case 'low': return 'low';
      default: return 'muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'fixed': return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-warning" />;
      case 'open': return <XCircle className="h-4 w-4 text-critical" />;
      default: return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <section id="dashboard" className="py-24 bg-background">
      <div className="container max-w-screen-xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4">
            Security Dashboard
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get real-time visibility into your security posture with actionable insights
            and AI-powered remediation guidance.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Security Score */}
          <Card className="gradient-card border-border/50 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Score</CardTitle>
              <Shield className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">92/100</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-success" />
                <span>+5 from last week</span>
              </div>
            </CardContent>
          </Card>

          {/* Active Scans */}
          <Card className="gradient-card border-border/50 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Scans</CardTitle>
              <Eye className="h-4 w-4 text-info" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <div className="text-xs text-muted-foreground">2 repositories, 1 live app</div>
            </CardContent>
          </Card>

          {/* Critical Issues */}
          <Card className="gradient-card border-border/50 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
              <AlertTriangle className="h-4 w-4 text-critical" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-critical">1</div>
              <div className="text-xs text-muted-foreground">Requires immediate attention</div>
            </CardContent>
          </Card>

          {/* Last Scan */}
          <Card className="gradient-card border-border/50 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Scan</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2m ago</div>
              <div className="text-xs text-muted-foreground">main branch updated</div>
            </CardContent>
          </Card>
        </div>

        {/* Vulnerabilities Table */}
        <Card className="gradient-card border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Recent Vulnerabilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vulnerabilities.map((vuln) => (
                <div 
                  key={vuln.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border/50 hover:bg-secondary/70 transition-smooth"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(vuln.status)}
                      <Badge 
                        variant="outline" 
                        className={`bg-${getSeverityColor(vuln.severity)}/10 border-${getSeverityColor(vuln.severity)}/20 text-${getSeverityColor(vuln.severity)}`}
                      >
                        {vuln.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{vuln.title}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <GitBranch className="h-3 w-3" />
                        <span>{vuln.file}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {vuln.status.replace('-', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default DashboardPreview;