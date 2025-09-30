import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Lock, 
  Eye, 
  Code, 
  Zap, 
  Brain,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Server,
  Database,
  Network,
  Bug,
  ShieldCheck,
  Activity,
  ArrowRight
} from 'lucide-react';

const Security = () => {
  const securityFeatures = [
    {
      icon: <Code className="h-10 w-10 text-accent" />,
      title: "Static Code Analysis",
      description: "Deep code scanning using advanced pattern matching and semantic analysis to identify security flaws before deployment.",
      features: [
        "SAST (Static Application Security Testing)",
        "Custom rule engine for your tech stack",
        "Zero false-positive filtering",
        "IDE integration for real-time feedback"
      ]
    },
    {
      icon: <Bug className="h-10 w-10 text-critical" />,
      title: "Vulnerability Detection",
      description: "Comprehensive vulnerability scanning across dependencies, containers, and infrastructure configurations.",
      features: [
        "CVE database integration (NVD, GitHub Advisory)",
        "Dependency vulnerability scanning",
        "Container image analysis",
        "Infrastructure-as-Code security checks"
      ]
    },
    {
      icon: <Eye className="h-10 w-10 text-info" />,
      title: "Runtime Protection",
      description: "Continuous monitoring and threat detection for deployed applications with real-time alerting.",
      features: [
        "Runtime Application Self-Protection (RASP)",
        "Anomaly detection with ML models",
        "API security monitoring",
        "DDoS and attack pattern detection"
      ]
    },
    {
      icon: <Brain className="h-10 w-10 text-success" />,
      title: "AI-Powered Remediation",
      description: "Intelligent fix suggestions with context-aware secure code examples and automated patching.",
      features: [
        "Automated vulnerability remediation",
        "Secure code generation",
        "Fix validation and testing",
        "Pull request automation"
      ]
    }
  ];

  const securityLayers = [
    {
      icon: <FileCode className="h-6 w-6" />,
      title: "Code Layer",
      description: "Source code vulnerabilities, insecure patterns, and code quality issues"
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "Dependency Layer",
      description: "Third-party libraries, packages, and supply chain security"
    },
    {
      icon: <Server className="h-6 w-6" />,
      title: "Infrastructure Layer",
      description: "Cloud configurations, containers, and deployment security"
    },
    {
      icon: <Network className="h-6 w-6" />,
      title: "Runtime Layer",
      description: "Live application monitoring, API security, and threat detection"
    }
  ];

  const complianceStandards = [
    "SOC 2 Type II",
    "ISO 27001",
    "PCI DSS",
    "HIPAA",
    "GDPR",
    "OWASP Top 10",
    "CWE Top 25",
    "NIST Framework"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-secondary/20 to-background">
          <div className="container max-w-screen-xl">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
                <Shield className="h-3 w-3 mr-1" />
                Enterprise-Grade Security
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Multi-Layer Security Platform
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Protect your applications at every stage with AI-powered security that adapts to your development workflow.
                From code commit to production deployment, DefenSys has you covered.
              </p>
            </div>

            <div className="flex justify-center gap-4 mb-16">
              <Button size="lg" className="gap-2">
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Schedule Demo
              </Button>
            </div>

            {/* Security Layers Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {securityLayers.map((layer, index) => (
                <Card key={index} className="border-border/50 bg-card/50">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-accent/10 text-accent">
                        {layer.icon}
                      </div>
                      <CardTitle className="text-lg">{layer.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{layer.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Main Security Features */}
        <section className="py-20">
          <div className="container max-w-screen-xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">
                Comprehensive Security Coverage
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our platform combines multiple security technologies to provide complete protection
                across your entire application lifecycle.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {securityFeatures.map((feature, index) => (
                <Card key={index} className="gradient-card border-border/50 shadow-card hover:shadow-glow transition-smooth">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-secondary/50">
                        {feature.icon}
                      </div>
                      <div>
                        <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                        <CardDescription className="text-base">
                          {feature.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.features.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-secondary/20">
          <div className="container max-w-screen-xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">
                How DefenSys Protects Your Applications
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our security platform works seamlessly across your development pipeline
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <Card className="border-border/50 text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                    <Zap className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle>1. Scan & Detect</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Automatically scan code, dependencies, and infrastructure for vulnerabilities
                    using AI-powered analysis engines.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-info/10">
                    <AlertTriangle className="h-8 w-8 text-info" />
                  </div>
                  <CardTitle>2. Analyze & Prioritize</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Understand the impact with attack chain simulation and risk scoring.
                    Focus on what matters most.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                    <ShieldCheck className="h-8 w-8 text-success" />
                  </div>
                  <CardTitle>3. Fix & Validate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Get AI-generated fixes with secure code examples. Validate remediation
                    with automated testing.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Compliance Section */}
        <section className="py-20">
          <div className="container max-w-screen-xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Built for Compliance
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Meet industry standards and regulatory requirements with comprehensive security reporting
              </p>
            </div>

            <Card className="border-border/50 bg-card/50">
              <CardContent className="pt-6">
                <div className="flex flex-wrap justify-center gap-4">
                  {complianceStandards.map((standard, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="px-4 py-2 text-sm font-medium"
                    >
                      <Lock className="h-3 w-3 mr-2" />
                      {standard}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
          <div className="container max-w-screen-xl">
            <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10">
              <CardContent className="p-12 text-center">
                <Activity className="h-12 w-12 text-accent mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-4">
                  Ready to Secure Your Applications?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Start protecting your code today with DefenSys. Get instant security insights
                  and AI-powered remediation for your entire development pipeline.
                </p>
                <div className="flex justify-center gap-4">
                  <Button size="lg" className="gap-2">
                    Get Started Free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline">
                    Contact Sales
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

export default Security;
