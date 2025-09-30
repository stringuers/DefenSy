import { Check, Shield, Zap, Users, Crown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import Header from "@/components/Header";
import PricingModal from "@/components/PricingModal";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";

const Pricing = () => {
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const { isAuthenticated } = useAuth();

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "0",
      period: "/month",
      description: "Perfect for individual developers getting started",
      popular: false,
      features: [
        "Up to 3 repository scans per month",
        "Basic vulnerability detection",
        "Community support",
        "Basic CI/CD integration",
        "Standard reporting"
      ],
      cta: "Start Free",
      variant: "outline" as const
    },
    {
      id: "developer",
      name: "Developer",
      price: "29",
      period: "/month",
      description: "Ideal for small teams and growing projects",
      popular: false,
      features: [
        "Unlimited repository scans",
        "Advanced SAST & DAST scanning",
        "Dependency vulnerability analysis",
        "AI-powered fix suggestions",
        "Email & Slack notifications",
        "Priority support",
        "Custom integrations"
      ],
      cta: "Start Developer",
      variant: "default" as const
    },
    {
      id: "team",
      name: "Team",
      price: "99",
      period: "/month",
      description: "Advanced security for collaborative teams",
      popular: true,
      features: [
        "Everything in Developer",
        "Live application monitoring",
        "Attack chain simulation",
        "Team collaboration features",
        "Custom security policies",
        "Advanced reporting & analytics",
        "SOC 2 compliance reports",
        "24/7 priority support"
      ],
      cta: "Start Team",
      variant: "default" as const
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "299",
      period: "/month",
      description: "Complete security solution for large organizations",
      popular: false,
      features: [
        "Everything in Team",
        "Multi-tenant architecture",
        "Custom security frameworks",
        "Advanced threat intelligence",
        "Dedicated security engineer",
        "Custom SLA agreements",
        "On-premise deployment options",
        "White-label solutions",
        "Advanced audit logs",
        "Custom integrations & APIs"
      ],
      cta: "Contact Sales",
      variant: "outline" as const
    },
    {
      id: "custom",
      name: "Custom",
      price: "Contact us",
      period: "",
      description: "Tailored security solutions for unique requirements",
      popular: false,
      features: [
        "All Enterprise features",
        "Custom security consulting",
        "Dedicated infrastructure",
        "Custom compliance frameworks",
        "Advanced threat modeling",
        "Security training programs",
        "Incident response support",
        "Custom development"
      ],
      cta: "Contact Enterprise",
      variant: "outline" as const
    }
  ];

  const handlePlanSelect = (plan: any) => {
    if (isAuthenticated) {
      setSelectedPlan(plan);
      setIsPricingModalOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleContactSales = () => {
    // In a real app, this would open a contact form or redirect to a contact page
    console.log('Contact sales clicked');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Header Section */}
        <section className="container max-w-screen-xl text-center mb-16">
          <div className="space-y-4">
            <Badge variant="outline" className="border-accent/20 text-accent bg-accent/10 px-4 py-1.5 mb-4">
              <Shield className="mr-2 h-3 w-3" />
              Choose Your Security Plan
            </Badge>
            
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              Secure at Any Scale
            </h1>
            
            <p className="mx-auto max-w-[600px] text-xl text-muted-foreground">
              From individual developers to enterprise teams, find the perfect security 
              solution that grows with your needs and keeps your applications safe.
            </p>
          </div>
        </section>

        {/* Pricing Grid */}
        <section className="container max-w-screen-2xl">
          <div className="grid gap-6 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2">
            {plans.map((plan, index) => (
              <Card 
                key={plan.name}
                className={`relative gradient-card border-border/50 shadow-card transition-smooth hover:shadow-glow ${
                  plan.popular ? 'ring-2 ring-accent/50 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-accent text-accent-foreground px-3 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl font-semibold text-foreground">
                    {plan.name}
                  </CardTitle>
                  
                  <div className="mt-4">
                    <div className="flex items-baseline justify-center">
                      {plan.price === "Contact us" ? (
                        <span className="text-2xl font-bold text-accent">Contact us</span>
                      ) : (
                        <>
                          <span className="text-3xl font-bold text-accent">${plan.price}</span>
                          <span className="text-muted-foreground text-sm">{plan.period}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    {plan.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <Button 
                    size="lg" 
                    variant={plan.popular ? "default" : plan.variant}
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-accent hover:bg-accent/90 text-accent-foreground shadow-glow' 
                        : ''
                    }`}
                    onClick={() => handlePlanSelect(plan)}
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <Check className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-foreground leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container max-w-screen-xl mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Common questions about DefenSys pricing and features
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            <Card className="gradient-card border-border/50 shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Can I upgrade or downgrade anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, you can change your plan at any time. Upgrades take effect immediately, 
                  and downgrades apply at your next billing cycle.
                </p>
              </CardContent>
            </Card>

            <Card className="gradient-card border-border/50 shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Do you offer annual billing?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, save 20% with annual billing. Contact our sales team for 
                  custom annual enterprise agreements.
                </p>
              </CardContent>
            </Card>

            <Card className="gradient-card border-border/50 shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">What's included in the free plan?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  The free plan includes 3 repository scans per month, basic vulnerability 
                  detection, and community support - perfect for getting started.
                </p>
              </CardContent>
            </Card>

            <Card className="gradient-card border-border/50 shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">How does enterprise support work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Enterprise customers get dedicated security engineers, 24/7 support, 
                  custom SLAs, and direct access to our security team.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container max-w-screen-xl mt-24 text-center">
          <Card className="gradient-card border-border/50 shadow-glow max-w-2xl mx-auto">
            <CardContent className="pt-8 pb-8">
              <Crown className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Ready to secure your applications?</h3>
              <p className="text-muted-foreground mb-6">
                Start with our free plan or contact sales for a personalized demo
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={() => handlePlanSelect(plans[0])}
                >
                  <Shield className="mr-2 h-5 w-5" />
                  Start Free Trial
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={handleContactSales}
                >
                  <Users className="mr-2 h-5 w-5" />
                  Contact Sales
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Modals */}
      <PricingModal 
        isOpen={isPricingModalOpen} 
        onClose={() => setIsPricingModalOpen(false)}
        selectedPlan={selectedPlan}
      />
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab="signup"
      />
    </div>
  );
};

export default Pricing;