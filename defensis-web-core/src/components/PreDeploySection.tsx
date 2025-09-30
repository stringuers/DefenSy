import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import ScanModal from './ScanModal';
import { 
  Code, 
  GitBranch, 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  Play,
  Settings,
  FileText,
  Zap
} from 'lucide-react';

const PreDeploySection = () => {
  const [activeScan, setActiveScan] = useState<string | null>(null);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<{ id?: string; name: string } | null>(null);

  const repositories = [
    {
      id: '1',
      name: 'defensis-web-core',
      branch: 'main',
      lastCommit: '2 hours ago',
      status: 'clean',
      vulnerabilities: 0,
      language: 'TypeScript',
      lastScan: '2 hours ago'
    },
    {
      id: '2',
      name: 'api-backend',
      branch: 'develop',
      lastCommit: '1 day ago',
      status: 'issues',
      vulnerabilities: 3,
      language: 'Python',
      lastScan: '1 day ago'
    },
    {
      id: '3',
      name: 'mobile-app',
      branch: 'main',
      lastCommit: '3 days ago',
      status: 'scanning',
      vulnerabilities: 1,
      language: 'React Native',
      lastScan: 'In progress...'
    }
  ];

  const scanTypes = [
    {
      name: 'SAST Scan',
      description: 'Static Application Security Testing',
      duration: '2-5 min',
      coverage: 'Source code analysis',
      icon: <Code className="h-5 w-5" />
    },
    {
      name: 'Dependency Scan',
      description: 'Third-party library vulnerabilities',
      duration: '1-3 min',
      coverage: 'Package dependencies',
      icon: <Shield className="h-5 w-5" />
    },
    {
      name: 'Secret Detection',
      description: 'API keys and credentials',
      duration: '1-2 min',
      coverage: 'Code and config files',
      icon: <AlertTriangle className="h-5 w-5" />
    },
    {
      name: 'Infrastructure Scan',
      description: 'IaC security analysis',
      duration: '3-7 min',
      coverage: 'Terraform, CloudFormation',
      icon: <Settings className="h-5 w-5" />
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'clean': return 'success';
      case 'issues': return 'warning';
      case 'scanning': return 'info';
      default: return 'muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'clean': return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'issues': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'scanning': return <Clock className="h-4 w-4 text-info" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const handleStartScan = (repoId: string, repoName: string) => {
    const repo = repositories.find(r => r.id === repoId);
    setSelectedRepo({ id: repoId, name: repoName });
    setIsScanModalOpen(true);
  };

  const handleScanAll = () => {
    setSelectedRepo({ name: 'All Repositories' });
    setIsScanModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Pre-Deploy Security</h2>
        <p className="text-muted-foreground">
          Scan your code and dependencies before deployment to catch vulnerabilities early
        </p>
      </div>

      {/* Repository Status */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="gradient-card border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-accent" />
              Repository Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {repositories.map((repo) => (
              <div key={repo.id} className="flex items-center justify-between p-4 border rounded-lg bg-secondary/50">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(repo.status)}
                    <Badge variant="outline" className={`text-xs bg-${getStatusColor(repo.status)}/10 border-${getStatusColor(repo.status)}/20 text-${getStatusColor(repo.status)}`}>
                      {repo.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{repo.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{repo.branch}</span>
                      <span>•</span>
                      <span>{repo.language}</span>
                      <span>•</span>
                      <span>Updated {repo.lastCommit}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {repo.vulnerabilities} issues
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Last scan: {repo.lastScan}
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleStartScan(repo.id, repo.name)}
                    disabled={repo.status === 'scanning'}
                  >
                    <Play className="mr-2 h-3 w-3" />
                    Scan
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="gradient-card border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-accent" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" onClick={handleScanAll}>
              <Play className="mr-2 h-4 w-4" />
              Scan All Repositories
            </Button>
            <Button variant="outline" className="w-full">
              <Settings className="mr-2 h-4 w-4" />
              Configure CI/CD Integration
            </Button>
            <Button variant="outline" className="w-full">
              <FileText className="mr-2 h-4 w-4" />
              View Security Policies
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Scan Types */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Available Scan Types</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {scanTypes.map((scan, index) => (
            <Card key={index} className="gradient-card border-border/50 shadow-card hover:shadow-glow transition-smooth">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg text-accent">
                    {scan.icon}
                  </div>
                  <div>
                    <CardTitle className="text-base">{scan.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">{scan.duration}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-3">
                  {scan.description}
                </p>
                <div className="text-xs text-muted-foreground">
                  Coverage: {scan.coverage}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Scan Progress */}
      {activeScan && (
        <Card className="gradient-card border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-info" />
              Scan in Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Scanning repositories...</span>
                <span>45%</span>
              </div>
              <Progress value={45} className="w-full" />
              <p className="text-xs text-muted-foreground">
                This may take a few minutes. You'll be notified when complete.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scan Modal */}
      {selectedRepo && (
        <ScanModal
          isOpen={isScanModalOpen}
          onClose={() => {
            setIsScanModalOpen(false);
            setSelectedRepo(null);
          }}
          repositoryName={selectedRepo.name}
          repositoryId={selectedRepo.id}
          scanType="full"
        />
      )}
    </div>
  );
};

export default PreDeploySection;
