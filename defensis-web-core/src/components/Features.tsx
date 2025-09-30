import { 
  Shield, 
  Code, 
  Zap, 
  GitBranch, 
  Eye, 
  Brain,
  Lock,
  Users,
  Bell
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      icon: <Code className="h-8 w-8 text-accent" />,
      title: "Pre-Deployment Scanning",
      description: "Catch vulnerabilities before they reach production with AI-powered code analysis and dependency scanning."
    },
    {
      icon: <Eye className="h-8 w-8 text-info" />,
      title: "Live Security Monitoring",
      description: "Continuous monitoring of deployed applications with real-time threat detection and response."
    },
    {
      icon: <Brain className="h-8 w-8 text-success" />,
      title: "AI-Powered Remediation",
      description: "Get intelligent fix suggestions with secure code examples and implementation guidance."
    },
    {
      icon: <Zap className="h-8 w-8 text-warning" />,
      title: "Attack Chain Simulation",
      description: "Understand how attackers exploit vulnerabilities with automated proof-of-concept generation."
    },
    {
      icon: <GitBranch className="h-8 w-8 text-accent" />,
      title: "CI/CD Integration",
      description: "Seamlessly integrate with GitHub, GitLab, and other platforms for automated security gates."
    },
    {
      icon: <Users className="h-8 w-8 text-info" />,
      title: "Team Collaboration",
      description: "Assign, track, and validate security fixes across your development and security teams."
    },
    {
      icon: <Lock className="h-8 w-8 text-critical" />,
      title: "Compliance Ready",
      description: "Meet SOC 2, ISO 27001, and other compliance requirements with detailed security reports."
    },
    {
      icon: <Bell className="h-8 w-8 text-medium" />,
      title: "Smart Notifications",
      description: "Get alerted about critical security issues via Slack, email, or webhook integrations."
    }
  ];

  return (
    <section id="features" className="py-24 bg-secondary/20">
      <div className="container max-w-screen-xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4">
            Comprehensive Security Platform
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From code to deployment, DefenSys provides end-to-end security coverage
            with intelligent automation and expert guidance.
          </p>
        </div>

        {/* Security Section */}
        <div id="security" className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-4">Advanced Security Features</h3>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Our AI-powered security engine provides comprehensive protection across your entire development lifecycle.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="gradient-card border-border/50 shadow-card hover:shadow-glow transition-smooth group"
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/50 group-hover:bg-accent/10 transition-smooth">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg font-semibold">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;