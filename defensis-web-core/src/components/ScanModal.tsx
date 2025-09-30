import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Shield, CheckCircle2, AlertTriangle, Clock, Zap, XCircle } from 'lucide-react';
import { startScan, getScanStatus, getScanResults } from '@/lib/api';

interface ScanResult {
  id: string;
  type: 'vulnerability' | 'dependency' | 'code_quality';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  file: string;
  line?: number;
  status: 'found' | 'scanning' | 'completed';
}

interface ScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  repositoryName?: string;
  repositoryId?: string;
  scanType?: string;
}

const ScanModal: React.FC<ScanModalProps> = ({ 
  isOpen, 
  onClose, 
  repositoryName = 'defensis-web-core',
  repositoryId,
  scanType = 'full'
}) => {
  const [scanProgress, setScanProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [scanId, setScanId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const scanPhases = [
    { name: 'Initializing scan...', duration: 1000 },
    { name: 'Analyzing dependencies...', duration: 2000 },
    { name: 'Scanning source code...', duration: 3000 },
    { name: 'Checking security patterns...', duration: 2000 },
    { name: 'Generating report...', duration: 1000 }
  ];

  const mockResults: ScanResult[] = [
    {
      id: '1',
      type: 'vulnerability',
      severity: 'critical',
      title: 'SQL Injection in user authentication',
      description: 'Direct SQL query construction without parameterization',
      file: 'src/auth.py',
      line: 45,
      status: 'found'
    },
    {
      id: '2',
      type: 'dependency',
      severity: 'high',
      title: 'Vulnerable dependency: lodash@4.17.20',
      description: 'Known vulnerability in lodash library',
      file: 'package.json',
      status: 'found'
    },
    {
      id: '3',
      type: 'code_quality',
      severity: 'medium',
      title: 'Missing CSRF protection',
      description: 'Forms lack CSRF token validation',
      file: 'src/forms.py',
      line: 12,
      status: 'found'
    },
    {
      id: '4',
      type: 'vulnerability',
      severity: 'low',
      title: 'Weak password policy',
      description: 'Password requirements are too lenient',
      file: 'src/config.py',
      line: 28,
      status: 'found'
    }
  ];

  const startScanProcess = async () => {
    try {
      setIsScanning(true);
      setScanProgress(0);
      setScanResults([]);
      setIsComplete(false);
      setError(null);

      // Start the scan via API
      const scanResponse = await startScan({
        repository_id: repositoryId,
        scan_type: scanType,
        target_path: null
      });

      setScanId(scanResponse.id);
      setCurrentPhase(scanResponse.current_phase || 'Initializing...');

      // Poll for scan status
      const pollInterval = setInterval(async () => {
        try {
          const status = await getScanStatus(scanResponse.id);
          
          setScanProgress(status.progress || 0);
          setCurrentPhase(status.current_phase || 'Processing...');

          if (status.status === 'completed') {
            clearInterval(pollInterval);
            
            // Fetch results
            const results = await getScanResults(scanResponse.id);
            
            // Convert API results to component format
            const formattedResults: ScanResult[] = results.vulnerabilities.map((vuln: any) => ({
              id: vuln.id,
              type: vuln.type as 'vulnerability' | 'dependency' | 'code_quality',
              severity: vuln.severity as 'critical' | 'high' | 'medium' | 'low',
              title: vuln.title,
              description: vuln.description || '',
              file: vuln.file_path || '',
              line: vuln.line_number,
              status: 'found' as const
            }));

            setScanResults(formattedResults);
            setIsScanning(false);
            setIsComplete(true);
            setScanProgress(100);

            toast({
              title: "Scan Complete!",
              description: `Found ${formattedResults.length} security issues in ${repositoryName}`,
            });
          } else if (status.status === 'failed') {
            clearInterval(pollInterval);
            throw new Error('Scan failed');
          }
        } catch (err) {
          clearInterval(pollInterval);
          throw err;
        }
      }, 2000); // Poll every 2 seconds

      // Timeout after 5 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
        if (isScanning) {
          setError('Scan timeout - please try again');
          setIsScanning(false);
        }
      }, 300000);

    } catch (err: any) {
      setError(err.message || 'Failed to start scan');
      setIsScanning(false);
      toast({
        title: "Scan Failed",
        description: err.message || 'An error occurred while scanning',
        variant: "destructive",
      });
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

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-critical" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-high" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-medium" />;
      case 'low': return <AlertTriangle className="h-4 w-4 text-low" />;
      default: return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  useEffect(() => {
    if (isOpen && !isScanning && !isComplete && !error) {
      startScanProcess();
    }
  }, [isOpen]);

  const handleRetry = () => {
    setError(null);
    startScanProcess();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-accent" />
            Security Scan: {repositoryName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {error ? (
            <div className="space-y-4">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-critical/10 rounded-full flex items-center justify-center mb-4">
                  <XCircle className="h-8 w-8 text-critical" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-critical">Scan Failed</h3>
                <p className="text-muted-foreground">{error}</p>
              </div>
              <div className="flex justify-center gap-2 pt-4">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button onClick={handleRetry}>
                  Retry Scan
                </Button>
              </div>
            </div>
          ) : !isComplete ? (
            <div className="space-y-4">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                  {isScanning ? (
                    <Zap className="h-8 w-8 text-accent animate-pulse" />
                  ) : (
                    <Shield className="h-8 w-8 text-accent" />
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {isScanning ? 'Scanning in Progress...' : 'Starting Security Scan'}
                </h3>
                <p className="text-muted-foreground">
                  {isScanning ? currentPhase : 'Preparing to scan your repository for security vulnerabilities.'}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(scanProgress)}%</span>
                </div>
                <Progress value={scanProgress} className="w-full" />
              </div>

              {isScanning && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>This may take a few minutes...</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Scan Complete!</h3>
                <p className="text-muted-foreground">
                  Found {scanResults.length} security issues in {repositoryName}
                </p>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto">
                {scanResults.map((result) => (
                  <div
                    key={result.id}
                    className="p-4 border rounded-lg bg-card"
                  >
                    <div className="flex items-start gap-3">
                      {getSeverityIcon(result.severity)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{result.title}</h4>
                          <Badge 
                            variant="outline" 
                            className={`text-xs bg-${getSeverityColor(result.severity)}/10 border-${getSeverityColor(result.severity)}/20 text-${getSeverityColor(result.severity)}`}
                          >
                            {result.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{result.description}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{result.file}</span>
                          {result.line && <span>Line {result.line}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button>
                  View Full Report
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScanModal;
