import React, { useState, useEffect } from 'react';
import { Plus, Search, TrendingUp, Clock, CheckCircle2, AlertTriangle, Construction, Trash2, Droplets, Zap, Shield, MoreHorizontal } from 'lucide-react';
import { Issue } from '../../lib/mockIssues';
import { IssueCard } from '../Issues/IssueCard';
import { mockIssueService } from '../../lib/mockIssues';
import { useAuth } from '../../hooks/useAuth';
import { ISSUE_CATEGORIES, STATUS_CONFIG } from '../../constants/categories';
import { RewardsCard } from '../Rewards/RewardsCard';

interface CitizenDashboardProps {
  onNavigate: (view: string) => void;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: '',
    category: '',
    search: '',
  });

  useEffect(() => {
    fetchIssues();
  }, [user, filter]);

  const fetchIssues = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await mockIssueService.getIssues(user.id);
    
    if (!error && data) {
      let filteredIssues = data;
      
      // Apply filters
      if (filter.status) {
        filteredIssues = filteredIssues.filter(issue => issue.status === filter.status);
      }
      if (filter.category) {
        filteredIssues = filteredIssues.filter(issue => issue.category === filter.category);
      }
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        filteredIssues = filteredIssues.filter(issue => 
          issue.title.toLowerCase().includes(searchLower) ||
          issue.description.toLowerCase().includes(searchLower)
        );
      }
      
      // Sort by created_at descending
      filteredIssues.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setIssues(filteredIssues);
    }
    setLoading(false);
  };

  const getStatusStats = () => {
    return {
      total: issues.length,
      pending: issues.filter(i => i.status === 'pending').length,
      in_progress: issues.filter(i => i.status === 'in_progress').length,
      resolved: issues.filter(i => i.status === 'resolved').length,
    };
  };

  const stats = getStatusStats();
  const categoryStats = ISSUE_CATEGORIES.map(category => ({
    ...category,
    count: issues.filter(i => i.category === category.id).length,
  }));

  const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
    Construction,
    Trash2,
    Droplets,
    Zap,
    Shield,
    MoreHorizontal,
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
            <p className="text-gray-600 mt-2">Track your reported issues and their status</p>
          </div>

        {/* Issues by Category */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Issues by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categoryStats.map((category) => {
              const Icon = ICONS[category.icon] || MoreHorizontal;
              const isActive = filter.category === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setFilter({ ...filter, category: category.id })}
                  className={`text-left p-4 rounded-lg border-2 transition shadow-sm hover:shadow ${category.color} ${isActive ? 'ring-2 ring-brand-400' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <Icon className="w-6 h-6" />
                    <span className="text-lg font-bold">{category.count}</span>
                  </div>
                  <p className="text-sm font-medium mt-2">{category.label}</p>
                  {isActive && (
                    <p className="mt-1 text-xs text-gray-600">Filtered</p>
                  )}
                </button>
              );
            })}
          </div>
          {filter.category && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setFilter({ ...filter, category: '' })}
                className="text-sm text-brand-600 hover:text-brand-700"
              >
                Clear category filter
              </button>
            </div>
          )}
        </div>
          <button
            onClick={() => onNavigate('report')}
            className="mt-4 sm:mt-0 bg-brand-600 text-white px-6 py-2 rounded-md hover:bg-brand-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Report New Issue</span>
          </button>
        </div>

        {/* Rewards / Gamification */}
        <div className="mb-6">
          <RewardsCard />
        </div>

        {/* Statistics Cards */
        }
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Issues</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-brand-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-brand-600">{stats.in_progress}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-brand-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search issues..."
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
              />
            </div>
            
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className="rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
            >
              <option value="">All Statuses</option>
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
            
            <select
              value={filter.category}
              onChange={(e) => setFilter({ ...filter, category: e.target.value })}
              className="rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
            >
              <option value="">All Categories</option>
              {ISSUE_CATEGORIES.map((category) => (
                <option key={category.id} value={category.id}>{category.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Issues List */}
      <div>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading your issues...</p>
          </div>
        ) : issues.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Issues Found</h3>
            <p className="text-gray-600 mb-4">
              {filter.search || filter.status || filter.category 
                ? "No issues match your current filters"
                : "You haven't reported any issues yet"
              }
            </p>
            <button
              onClick={() => onNavigate('report')}
              className="bg-brand-600 text-white px-6 py-2 rounded-md hover:bg-brand-700 transition-colors"
            >
              Report Your First Issue
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {issues.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                onClick={() => {/* Navigate to issue details */}}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};