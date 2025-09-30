import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Header from '@/components/Header';
import DashboardStats from '@/components/DashboardStats';
import PreDeploySection from '@/components/PreDeploySection';
import PostDeploySection from '@/components/PostDeploySection';
import RecentScans from '@/components/RecentScans';
import SecurityAlerts from '@/components/SecurityAlerts';
import VulnerabilityTrendsChart from '@/components/VulnerabilityTrendsChart';
import SecurityScoreChart from '@/components/SecurityScoreChart';
import ScanActivityChart from '@/components/ScanActivityChart';
import VulnerabilityDistributionChart from '@/components/VulnerabilityDistributionChart';

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'pre-deploy' | 'post-deploy'>('overview');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null; // Will redirect to home
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        {/* Dashboard Header */}
        <section className="border-b border-border/40 bg-card/50">
          <div className="container max-w-screen-2xl py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Welcome back, {user?.name}!
                </h1>
                <p className="text-muted-foreground mt-2">
                  Monitor your security posture and manage your applications
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">All systems operational</span>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <section className="border-b border-border/40">
          <div className="container max-w-screen-2xl">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'overview'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('pre-deploy')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'pre-deploy'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                Pre-Deploy Security
              </button>
              <button
                onClick={() => setActiveTab('post-deploy')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'post-deploy'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                Post-Deploy Monitoring
              </button>
            </nav>
          </div>
        </section>

        {/* Dashboard Content */}
        <section className="py-8">
          <div className="container max-w-screen-2xl">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Statistics Cards */}
                <DashboardStats />
                
                {/* Charts Section */}
                <div className="grid gap-6 lg:grid-cols-2">
                  <SecurityScoreChart />
                  <VulnerabilityDistributionChart />
                </div>
                
                <VulnerabilityTrendsChart />
                
                <div className="grid gap-6 lg:grid-cols-2">
                  <ScanActivityChart />
                  <div className="space-y-6">
                    <RecentScans />
                  </div>
                </div>
                
                {/* Security Alerts */}
                <SecurityAlerts />
              </div>
            )}

            {activeTab === 'pre-deploy' && (
              <PreDeploySection />
            )}

            {activeTab === 'post-deploy' && (
              <PostDeploySection />
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
