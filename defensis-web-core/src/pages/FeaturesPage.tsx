import React, { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Code, 
  Eye, 
  Brain, 
  Zap, 
  GitBranch, 
  Users, 
  Lock, 
  Bell,
  CheckCircle2,
  ArrowRight,
  Shield,
  Terminal,
  FileCode,
  Workflow,
  BarChart3,
  Sparkles,
  Clock,
  Globe,
  Layers
} from 'lucide-react';

const FeaturesPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const featureCategories = [
    { id: 'all', label: 'All Features', icon: <Layers className="h-4 w-4" /> },
    { id: 'scanning', label: 'Scanning', icon: <Code className="h-4 w-4" /> },
    { id: 'monitoring', label: 'Monitoring', icon: <Eye className="h-4 w-4" /> },
    { id: 'automation', label: 'Automation', icon: <Zap className="h-4 w-4" /> },
    { id: 'collaboration', label: 'Collaboration', icon: <Users className="h-4 w-4" /> }
  ];

  const features = [
    {
      category: 'scanning',
      icon: <Code className="h-8 w-8 text-accent" />,
      title: "Pre-Deployment Scanning",
      description: "Catch vulnerabilities before they reach production with comprehensive code analysis.",
      capabilities: [
        "SAST & DAST security testing",
        "Dependency vulnerability scanning",
        "Secret detection and prevention",
        "License compliance checking",
        "Custom security rule engine"
      ],
      badge: "Core Feature"
    },
    {
      category: 'monitoring',
      icon: <Eye className="h-8 w-8 text-info" />,
      title: "Live Security Monitoring",
      description: "Continuous monitoring of deployed applications with real-time threat detection.",
      capabilities: [
        "Runtime application protection",
        "API security monitoring",
        "Anomaly detection with ML",
        "Attack pattern recognition",
        "Performance impact monitoring"
      ],
      badge: "Real-time"
    },
    {
      category: 'automation',
      icon: <Brain className="h-8 w-8 text-success" />,
      title: "AI-Powered Remediation",
      description: "Get intelligent fix suggestions with secure code examples and automated patching.",
      capabilities: [
        "Automated vulnerability fixes",
        "Secure code generation",
        "Context-aware suggestions",
        "Fix validation & testing",
        "One-click remediation"
      ],
      badge: "AI-Powered"
    },
    {
      category: 'scanning',
      icon: <Zap className="h-8 w-8 text-warning" />,
      title: "Attack Chain Simulation",
      description: "Understand how attackers exploit vulnerabilities with automated PoC generation.",
      capabilities: [
        "Exploit path visualization",
        "Impact assessment",
        "Proof-of-concept generation",
        "Risk scoring & prioritization",
        "Attack vector analysis"
      ],
      badge: "Advanced"
    },
    {
      category: 'automation',
      icon: <GitBranch className="h-8 w-8 text-accent" />,
      title: "CI/CD Integration",
      description: "Seamlessly integrate with your existing development workflow and tools.",
      capabilities: [
        "GitHub, GitLab, Bitbucket support",
        "Jenkins, CircleCI, Travis CI",
        "Automated security gates",
        "Pull request automation",
        "Custom webhook integration"
      ],
      badge: "Integration"
    },
    {
      category: 'collaboration',
      icon: <Users className="h-8 w-8 text-info" />,
      title: "Team Collaboration",
      description: "Assign, track, and validate security fixes across your teams.",
      capabilities: [
        "Role-based access control",
        "Issue assignment & tracking",
        "Team performance metrics",
        "Shared security policies",
        "Audit logs & compliance"
      ],
      badge: "Enterprise"
    },
    {
      category: 'scanning',
      icon: <Lock className="h-8 w-8 text-critical" />,
      title: "Compliance Ready",
      description: "Meet regulatory requirements with detailed security reports and auditing.",
      capabilities: [
        "SOC 2, ISO 27001 compliance",
        "PCI DSS, HIPAA support",
        "Automated compliance reports",
        "Policy enforcement",
        "Audit trail generation"
      ],
      badge: "Compliance"
    },
    {
      category: 'collaboration',
      icon: <Bell className="h-8 w-8 text-medium" />,
      title: "Smart Notifications",
      description: "Get alerted about critical security issues via your preferred channels.",
      capabilities: [
        "Slack, Teams, Discord integration",
        "Email & SMS alerts",
        "Custom webhook notifications",
        "Alert prioritization",
        "Notification scheduling"
      ],
      badge: "Integration"
    },
    {
      category: 'monitoring',
      icon: <BarChart3 className="h-8 w-8 text-success" />,
      title: "Security Analytics",
      description: "Comprehensive dashboards and reports for security posture visibility.",
      capabilities: [
        "Real-time security metrics",
        "Trend analysis & forecasting",
        "Custom report generation",
        "Executive summaries",
        "Vulnerability heatmaps"
      ],
      badge: "Analytics"
    }
  ];

  const integrations = [
    { name: "GitHub", icon: <GitBranch className="h-6 w-6" /> },
    { name: "GitLab", icon: <GitBranch className="h-6 w-6" /> },
    { name: "Slack", icon: <Bell className="h-6 w-6" /> },
    { name: "Jira", icon: <Workflow className="h-6 w-6" /> },
    { name: "Jenkins", icon: <Terminal className="h-6 w-6" /> },
    { name: "Docker", icon: <Layers className="h-6 w-6" /> }
  ];

  const filteredFeatures = activeCategory === 'all' 
    ? features 
    : features.filter(f => f.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-secondary/20 to-background">
          <div className="container max-w-screen-xl">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
                <Sparkles className="h-3 w-3 mr-1" />
                Full Feature Suite
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Everything You Need to Secure Your Code
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                From pre-deployment scanning to runtime protection, DefenSys provides a complete
                security platform that grows with your team.
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <Button size="lg" className="gap-2">
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                View Pricing
              </Button>
            </div>
          </div>
        </section>

        {/* Feature Categories */}
        <section className="py-12 border-b border-border/40">
          <div className="container max-w-screen-xl">
            <div className="flex flex-wrap justify-center gap-3">
              {featureCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  onClick={() => setActiveCategory(category.id)}
                  className="gap-2"
                >
                  {category.icon}
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="container max-w-screen-xl">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredFeatures.map((feature, index) => (
                <Card 
                  key={index}
                  className="gradient-card border-border/50 shadow-card hover:shadow-glow transition-smooth group"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-lg bg-secondary/50 group-hover:bg-accent/10 transition-smooth">
                        {feature.icon}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {feature.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.capabilities.map((capability, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{capability}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Integrations Section */}
        <section className="py-20 bg-secondary/20">
          <div className="container max-w-screen-xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Seamless Integrations
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Connect DefenSys with your favorite tools and platforms
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-6">
              {integrations.map((integration, index) => (
                <Card 
                  key={index}
                  className="border-border/50 hover:border-accent/50 transition-smooth text-center"
                >
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-3 rounded-lg bg-accent/10 text-accent">
                        {integration.icon}
                      </div>
                      <span className="font-medium text-sm">{integration.name}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button variant="outline" className="gap-2">
                <Globe className="h-4 w-4" />
                View All Integrations
              </Button>
            </div>
          </div>
        </section>

        {/* Platform Benefits */}
        <section className="py-20">
          <div className="container max-w-screen-xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Why Choose DefenSys?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Built for modern development teams who need speed without compromising security
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-border/50 text-center">
                <CardHeader>
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                    <Clock className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="text-lg">Save Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Reduce security review time by 80% with automated scanning and AI-powered fixes
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 text-center">
                <CardHeader>
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                    <Shield className="h-6 w-6 text-success" />
                  </div>
                  <CardTitle className="text-lg">Stay Secure</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Catch 95% of vulnerabilities before they reach production
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 text-center">
                <CardHeader>
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-info/10">
                    <Zap className="h-6 w-6 text-info" />
                  </div>
                  <CardTitle className="text-lg">Ship Faster</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Integrate security into CI/CD without slowing down deployments
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 text-center">
                <CardHeader>
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-warning/10">
                    <BarChart3 className="h-6 w-6 text-warning" />
                  </div>
                  <CardTitle className="text-lg">Gain Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Track security metrics and demonstrate compliance with ease
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
          <div className="container max-w-screen-xl">
            <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10">
              <CardContent className="p-12 text-center">
                <Shield className="h-12 w-12 text-accent mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-4">
                  Ready to Experience All Features?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Start your free trial today and discover how DefenSys can transform
                  your application security workflow.
                </p>
                <div className="flex justify-center gap-4">
                  <Button size="lg" className="gap-2">
                    Start Free Trial
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline">
                    Schedule Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
};

export default FeaturesPage;
