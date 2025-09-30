import { Shield, ArrowRight, Github, Zap, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "./AuthModal";
import GitHubModal from "./GitHubModal";
import ScanModal from "./ScanModal";

const Hero = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleStartFreeScan = () => {
    if (isAuthenticated) {
      setIsScanModalOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleConnectRepository = () => {
    if (isAuthenticated) {
      setIsGitHubModalOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center gradient-hero overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-[40rem] w-[40rem] rounded-full bg-accent/20 blur-3xl" />
        </div>

        <div className="container relative z-10 max-w-screen-xl">
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Badge */}
            <Badge variant="outline" className="border-accent/20 text-accent bg-accent/10 px-4 py-1.5">
              <Zap className="mr-2 h-3 w-3" />
              Where Intelligence Meets Security
            </Badge>

            {/* Main headline */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Secure Your Code
                <br />
                <span className="text-accent">Before It Ships</span>
              </h1>
              
              <p className="mx-auto max-w-[600px] text-xl text-muted-foreground sm:text-2xl">
                AI-powered cybersecurity platform that detects vulnerabilities, simulates attacks,
                and provides intelligent remediation guidance throughout your development lifecycle.
              </p>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-glow"
                onClick={handleStartFreeScan}
              >
                <Shield className="mr-2 h-5 w-5" />
                Start Free Scan
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-accent/20 hover:bg-accent/10"
                onClick={handleConnectRepository}
              >
                <Github className="mr-2 h-5 w-5" />
                Connect Repository
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-col sm:flex-row items-center gap-6 text-sm text-muted-foreground pt-8">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-accent" />
                <span>SOC 2 Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-accent" />
                <span>Zero Data Retention</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-accent" />
                <span>&lt;3min CI/CD Integration</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab="signup"
      />
      <GitHubModal 
        isOpen={isGitHubModalOpen} 
        onClose={() => setIsGitHubModalOpen(false)}
      />
      <ScanModal 
        isOpen={isScanModalOpen} 
        onClose={() => setIsScanModalOpen(false)}
        repositoryName="defensis-web-core"
      />
    </>
  );
};

export default Hero;