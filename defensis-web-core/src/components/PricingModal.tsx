import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Check, Crown, CreditCard, Shield, Zap } from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
}

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan?: PricingPlan;
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, selectedPlan }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const plans: PricingPlan[] = [
    {
      id: 'free',
      name: 'Free',
      price: '0',
      period: '/month',
      description: 'Perfect for individual developers getting started',
      features: [
        'Up to 3 repository scans per month',
        'Basic vulnerability detection',
        'Community support',
        'Basic CI/CD integration',
        'Standard reporting'
      ],
      popular: false
    },
    {
      id: 'developer',
      name: 'Developer',
      price: '29',
      period: '/month',
      description: 'Ideal for small teams and growing projects',
      features: [
        'Unlimited repository scans',
        'Advanced SAST & DAST scanning',
        'Dependency vulnerability analysis',
        'AI-powered fix suggestions',
        'Email & Slack notifications',
        'Priority support',
        'Custom integrations'
      ],
      popular: false
    },
    {
      id: 'team',
      name: 'Team',
      price: '99',
      period: '/month',
      description: 'Advanced security for collaborative teams',
      features: [
        'Everything in Developer',
        'Live application monitoring',
        'Attack chain simulation',
        'Team collaboration features',
        'Custom security policies',
        'Advanced reporting & analytics',
        'SOC 2 compliance reports',
        '24/7 priority support'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '299',
      period: '/month',
      description: 'Complete security solution for large organizations',
      features: [
        'Everything in Team',
        'Multi-tenant architecture',
        'Custom security frameworks',
        'Advanced threat intelligence',
        'Dedicated security engineer',
        'Custom SLA agreements',
        'On-premise deployment options',
        'White-label solutions',
        'Advanced audit logs',
        'Custom integrations & APIs'
      ],
      popular: false
    }
  ];

  const currentPlan = selectedPlan || plans[1]; // Default to Developer plan
  const yearlyDiscount = 0.2; // 20% discount for yearly billing
  const monthlyPrice = parseInt(currentPlan.price);
  const yearlyPrice = Math.round(monthlyPrice * 12 * (1 - yearlyDiscount));
  const displayPrice = billingCycle === 'yearly' ? yearlyPrice : monthlyPrice;
  const displayPeriod = billingCycle === 'yearly' ? '/year' : currentPlan.period;

  const handleSubscribe = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Subscription Successful!",
        description: `Welcome to the ${currentPlan.name} plan! Your account has been upgraded.`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Unable to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContactSales = () => {
    toast({
      title: "Contact Sales",
      description: "Our sales team will contact you within 24 hours.",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-accent" />
            Choose Your Plan
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Billing Toggle */}
          <div className="flex items-center justify-center">
            <div className="flex items-center bg-muted rounded-lg p-1">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setBillingCycle('monthly')}
              >
                Monthly
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  billingCycle === 'yearly'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setBillingCycle('yearly')}
              >
                Yearly
                <Badge variant="secondary" className="ml-2 text-xs">Save 20%</Badge>
              </button>
            </div>
          </div>

          {/* Selected Plan */}
          <div className="border rounded-lg p-6 bg-card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold">{currentPlan.name}</h3>
                <p className="text-muted-foreground text-sm">{currentPlan.description}</p>
              </div>
              {currentPlan.popular && (
                <Badge className="bg-accent text-accent-foreground">Most Popular</Badge>
              )}
            </div>

            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">${displayPrice}</span>
                <span className="text-muted-foreground ml-1">{displayPeriod}</span>
              </div>
              {billingCycle === 'yearly' && (
                <p className="text-sm text-green-600 mt-1">
                  Save ${(monthlyPrice * 12) - yearlyPrice} per year
                </p>
              )}
            </div>

            <div className="space-y-3 mb-6">
              {currentPlan.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {currentPlan.id === 'enterprise' ? (
                <Button 
                  onClick={handleContactSales}
                  className="w-full"
                  variant="outline"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Contact Sales
                </Button>
              ) : (
                <Button 
                  onClick={handleSubscribe}
                  disabled={isProcessing}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Zap className="mr-2 h-4 w-4 animate-pulse" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Subscribe Now
                    </>
                  )}
                </Button>
              )}

              <p className="text-xs text-center text-muted-foreground">
                {currentPlan.id === 'free' 
                  ? 'No credit card required'
                  : 'Cancel anytime. 30-day money-back guarantee.'
                }
              </p>
            </div>
          </div>

          {/* Security Badges */}
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              <span>SOC 2 Compliant</span>
            </div>
            <div className="flex items-center gap-1">
              <Check className="h-3 w-3" />
              <span>256-bit SSL</span>
            </div>
            <div className="flex items-center gap-1">
              <Crown className="h-3 w-3" />
              <span>Enterprise Ready</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PricingModal;
