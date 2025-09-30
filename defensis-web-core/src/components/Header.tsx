import { Shield, Menu, Github, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "./AuthModal";
import GitHubModal from "./GitHubModal";

const Header = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');
  const { isAuthenticated, user, logout } = useAuth();

  const handleSignIn = () => {
    setAuthModalTab('login');
    setIsAuthModalOpen(true);
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      setIsGitHubModalOpen(true);
    } else {
      setAuthModalTab('signup');
      setIsAuthModalOpen(true);
    }
  };

  const handleGithubClick = () => {
    if (isAuthenticated) {
      setIsGitHubModalOpen(true);
    } else {
      setAuthModalTab('login');
      setIsAuthModalOpen(true);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center">
          {/* Logo */}
          <Link to="/" className="mr-4 flex items-center space-x-2">
            <Shield className="h-8 w-8 text-accent" />
            <span className="text-xl font-bold text-foreground">
              Defen<span className="text-accent">Sys</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6 text-sm lg:gap-8">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="transition-smooth hover:text-accent text-muted-foreground"
                >
                  Dashboard
                </Link>
                <Link
                  to="/features"
                  className="transition-smooth hover:text-accent text-muted-foreground"
                >
                  Features
                </Link>
                <Link
                  to="/security"
                  className="transition-smooth hover:text-accent text-muted-foreground"
                >
                  Security
                </Link>
                <Link
                  to="/pricing"
                  className="transition-smooth hover:text-accent text-muted-foreground"
                >
                  Pricing
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/features"
                  className="transition-smooth hover:text-accent text-muted-foreground"
                >
                  Features
                </Link>
                <Link
                  to="/security"
                  className="transition-smooth hover:text-accent text-muted-foreground"
                >
                  Security
                </Link>
                <Link
                  to="/pricing"
                  className="transition-smooth hover:text-accent text-muted-foreground"
                >
                  Pricing
                </Link>
              </>
            )}
          </nav>

          {/* Right side */}
          <div className="flex flex-1 items-center justify-end space-x-4">
            <Button variant="ghost" size="icon" onClick={handleGithubClick}>
              <Github className="h-5 w-5" />
            </Button>
            
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user?.name}</span>
                </div>
                <Button variant="ghost" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={handleSignIn}>
                  Sign In
                </Button>
                <Button variant="default" onClick={handleGetStarted}>
                  Get Started
                </Button>
              </>
            )}

            {/* Mobile menu */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Modals */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
      <GitHubModal 
        isOpen={isGitHubModalOpen} 
        onClose={() => setIsGitHubModalOpen(false)}
      />
    </>
  );
};

export default Header;