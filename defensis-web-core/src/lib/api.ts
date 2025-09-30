const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('defensis_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Dashboard API
export const getDashboardStats = async () => {
  try {
    const response = await fetch(`${API_URL}/api/dashboard/stats`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch dashboard stats');
    return response.json();
  } catch (error) {
    console.error('Dashboard stats error:', error);
    // Return default values if API fails
    return {
      security_score: 0,
      active_scans: 0,
      critical_issues: 0,
      issues_resolved: 0,
      repositories: 0,
      total_scans: 0,
      vulnerabilities: 0
    };
  }
};

export const getRecentScans = async () => {
  const response = await fetch(`${API_URL}/api/dashboard/recent-scans`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch recent scans');
  return response.json();
};

export const getSecurityAlerts = async () => {
  const response = await fetch(`${API_URL}/api/dashboard/alerts`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch security alerts');
  return response.json();
};

// Repositories API
export const getRepositories = async () => {
  const response = await fetch(`${API_URL}/api/repositories`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch repositories');
  return response.json();
};

export const createRepository = async (repoData: any) => {
  const response = await fetch(`${API_URL}/api/repositories`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(repoData),
  });
  if (!response.ok) throw new Error('Failed to create repository');
  return response.json();
};

// Scans API
export const startScan = async (scanData: any) => {
  const response = await fetch(`${API_URL}/api/scans/start`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(scanData),
  });
  if (!response.ok) throw new Error('Failed to start scan');
  return response.json();
};

export const getScanStatus = async (scanId: string) => {
  const response = await fetch(`${API_URL}/api/scans/${scanId}/status`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch scan status');
  return response.json();
};

export const getScanResults = async (scanId: string) => {
  const response = await fetch(`${API_URL}/api/scans/${scanId}/results`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch scan results');
  return response.json();
};

// GitHub API
export const connectGitHub = async () => {
  const response = await fetch(`${API_URL}/api/github/connect`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to connect GitHub');
  return response.json();
};

export default {
  getDashboardStats,
  getRecentScans,
  getSecurityAlerts,
  getRepositories,
  createRepository,
  startScan,
  getScanStatus,
  getScanResults,
  connectGitHub,
};
