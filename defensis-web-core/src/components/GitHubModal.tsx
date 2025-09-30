import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Github, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';

interface Repository {
  id: string;
  name: string;
  fullName: string;
  description: string;
  language: string;
  isPrivate: boolean;
  lastUpdated: string;
}

interface GitHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GitHubModal: React.FC<GitHubModalProps> = ({ isOpen, onClose }) => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  // Mock repositories data
  const mockRepositories: Repository[] = [
    {
      id: '1',
      name: 'defensis-web-core',
      fullName: 'user/defensis-web-core',
      description: 'Main DefenSys web application',
      language: 'TypeScript',
      isPrivate: false,
      lastUpdated: '2 hours ago'
    },
    {
      id: '2',
      name: 'api-backend',
      fullName: 'user/api-backend',
      description: 'DefenSys API backend service',
      language: 'Python',
      isPrivate: true,
      lastUpdated: '1 day ago'
    },
    {
      id: '3',
      name: 'mobile-app',
      fullName: 'user/mobile-app',
      description: 'DefenSys mobile application',
      language: 'React Native',
      isPrivate: false,
      lastUpdated: '3 days ago'
    }
  ];

  const handleConnectGitHub = async () => {
    setIsLoading(true);
    
    try {
      // Simulate GitHub OAuth flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsConnected(true);
      setRepositories(mockRepositories);
      
      toast({
        title: "GitHub Connected!",
        description: "Successfully connected to your GitHub account.",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Unable to connect to GitHub. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRepoSelect = (repoId: string) => {
    setSelectedRepos(prev => 
      prev.includes(repoId) 
        ? prev.filter(id => id !== repoId)
        : [...prev, repoId]
    );
  };

  const handleStartScanning = () => {
    if (selectedRepos.length === 0) {
      toast({
        title: "No repositories selected",
        description: "Please select at least one repository to scan.",
        variant: "destructive",
      });
      return;
    }

    const selectedRepoNames = repositories
      .filter(repo => selectedRepos.includes(repo.id))
      .map(repo => repo.fullName);

    toast({
      title: "Scanning Started!",
      description: `Started security scanning for ${selectedRepos.length} repository(ies).`,
    });

    // In a real app, this would trigger actual scanning
    console.log('Starting scan for repositories:', selectedRepoNames);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Github className="h-6 w-6 text-accent" />
            Connect GitHub Repository
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!isConnected ? (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                <Github className="h-8 w-8 text-accent" />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold">Connect Your GitHub Account</h3>
                <p className="text-muted-foreground">
                  Connect your GitHub account to start scanning your repositories for security vulnerabilities.
                </p>
              </div>

              <Button 
                onClick={handleConnectGitHub} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Connecting...' : 'Connect with GitHub'}
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>

              <p className="text-xs text-muted-foreground">
                We'll only access your public repositories and won't store your code.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm font-medium">GitHub Connected Successfully</span>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Select Repositories to Scan</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Choose which repositories you'd like to include in your security scanning.
                </p>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto">
                {repositories.map((repo) => (
                  <div
                    key={repo.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedRepos.includes(repo.id)
                        ? 'border-accent bg-accent/5'
                        : 'border-border hover:border-accent/50'
                    }`}
                    onClick={() => handleRepoSelect(repo.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{repo.name}</h4>
                          {repo.isPrivate && (
                            <Badge variant="secondary" className="text-xs">Private</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{repo.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{repo.language}</span>
                          <span>Updated {repo.lastUpdated}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        {selectedRepos.includes(repo.id) ? (
                          <CheckCircle2 className="h-5 w-5 text-accent" />
                        ) : (
                          <div className="h-5 w-5 border-2 border-muted-foreground rounded-full" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4">
                <span className="text-sm text-muted-foreground">
                  {selectedRepos.length} repository(ies) selected
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button onClick={handleStartScanning} disabled={selectedRepos.length === 0}>
                    Start Scanning
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GitHubModal;
