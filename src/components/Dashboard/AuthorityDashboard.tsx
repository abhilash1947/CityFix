import React, { useState, useEffect } from 'react';
import { Search, Filter, Users, BarChart3, Clock, AlertTriangle, MapPin, Calendar, Edit2, Construction, Trash2, Droplets, Zap, Shield, MoreHorizontal } from 'lucide-react';
import { Issue, mockIssueService } from '../../lib/mockIssues';
import { ISSUE_CATEGORIES, STATUS_CONFIG } from '../../constants/categories';

export const AuthorityDashboard: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [currentIssue, setCurrentIssue] = useState<Issue | null>(null);
  const [statusComment, setStatusComment] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState({
    status: '',
    category: '',
    urgency: '',
    search: '',
  });

  useEffect(() => {
    fetchIssues();
  }, [filter]);

  const fetchIssues = async () => {
    setLoading(true);
    const { data, error } = await mockIssueService.getIssues();
    
    if (!error && data) {
      let filteredIssues = data;
      
      // Apply filters
      if (filter.status) {
        filteredIssues = filteredIssues.filter(issue => issue.status === filter.status);
      }
      if (filter.category) {
        filteredIssues = filteredIssues.filter(issue => issue.category === filter.category);
      }
      if (filter.urgency) {
        filteredIssues = filteredIssues.filter(issue => issue.urgency === filter.urgency);
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

  const handleStatusUpdate = async (issueIds: string[], newStatus: Issue['status'], _comment: string) => {
    try {
      setUpdating(true);
      let ok = 0;
      for (const issueId of issueIds) {
        const { error } = await mockIssueService.updateIssueStatus(issueId, newStatus as any);
        if (!error) ok++;
      }
      fetchIssues();
      setActionMessage(`Updated ${ok}/${issueIds.length} issue(s) to '${STATUS_CONFIG[newStatus]?.label || newStatus}'.`);
      setTimeout(() => setActionMessage(null), 2500);
    } finally {
      setUpdating(false);
      setShowStatusModal(false);
      setStatusComment('');
      setCurrentIssue(null);
    }
  };

  const handleBulkStatusUpdate = async (status: string) => {
    if (selectedIssues.length === 0) return;
    try {
      setUpdating(true);
      let ok = 0;
      for (const issueId of selectedIssues) {
        const { error } = await mockIssueService.updateIssueStatus(issueId, status as any);
        if (!error) ok++;
      }
      setSelectedIssues([]);
      fetchIssues();
      setActionMessage(`Bulk update: ${ok} issue(s) marked ${STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]?.label || status}.`);
      setTimeout(() => setActionMessage(null), 2500);
    } finally {
      setUpdating(false);
    }
  };

  const openStatusModal = (issue: Issue) => {
    setCurrentIssue(issue);
    setNewStatus(issue.status);
    setShowStatusModal(true);
  };

  const getStats = () => {
    return {
      total: issues.length,
      pending: issues.filter(i => i.status === 'pending').length,
      in_progress: issues.filter(i => i.status === 'in_progress').length,
      resolved: issues.filter(i => i.status === 'resolved').length,
      high_urgency: issues.filter(i => i.urgency === 'high').length,
    };
  };

  const getCategoryStats = () => {
    return ISSUE_CATEGORIES.map(category => ({
      ...category,
      count: issues.filter(i => i.category === category.id).length
    }));
  };

  const stats = getStats();
  const categoryStats = getCategoryStats();

  // Safe icon registry instead of eval to avoid runtime errors
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
      {actionMessage && (
        <div className="mb-4 rounded-lg border border-brand-200 bg-brand-50 text-brand-800 px-4 py-2 text-sm">
          {actionMessage}
        </div>
      )}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Authority Dashboard</h1>
        <p className="text-gray-600">Monitor and manage civic issues in your jurisdiction</p>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Issues</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-brand-600" />
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
            <Users className="w-8 h-8 text-brand-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
            </div>
            <MapPin className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-red-600">{stats.high_urgency}</p>
            </div>
            <Filter className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
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
                title={`Show ${category.label} issues`}
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

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          
          <select
            value={filter.urgency}
            onChange={(e) => setFilter({ ...filter, urgency: e.target.value })}
            className="rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
          >
            <option value="">All Urgency Levels</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIssues.length > 0 && (
        <div className="bg-brand-50 border border-brand-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-brand-800">
              {selectedIssues.length} issue(s) selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkStatusUpdate('in_progress')}
                disabled={updating}
                className={`px-3 py-1 text-white text-sm rounded ${updating ? 'bg-brand-400 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700'}`}
              >
                Mark In Progress
              </button>
              <button
                onClick={() => handleBulkStatusUpdate('resolved')}
                disabled={updating}
                className={`px-3 py-1 text-white text-sm rounded ${updating ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
              >
                Mark Resolved
              </button>
              <button
                onClick={() => setSelectedIssues([])}
                disabled={updating}
                className={`px-3 py-1 text-white text-sm rounded ${updating ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-700'}`}
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Issues List */}
      <div>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading issues...</p>
          </div>
        ) : issues.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Issues Found</h3>
            <p className="text-gray-600">
              No issues match your current filters
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {issues.map((issue) => (
              <div key={issue.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedIssues.includes(issue.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIssues([...selectedIssues, issue.id]);
                        } else {
                          setSelectedIssues(selectedIssues.filter(id => id !== issue.id));
                        }
                      }}
                      className="mt-1 h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{issue.title}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_CONFIG[issue.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                          {STATUS_CONFIG[issue.status]?.label || issue.status}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          issue.urgency === 'high' ? 'bg-red-100 text-red-800 border-red-200' :
                          issue.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                          'bg-green-100 text-green-800 border-green-200'
                        }`}>
                          {issue.urgency.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{issue.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{issue.location.address}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      {issue.photos && issue.photos.length > 0 && (
                        <div className="mt-3 flex space-x-2">
                          {issue.photos.slice(0, 3).map((photo, index) => (
                            <img
                              key={index}
                              src={photo}
                              alt={`Issue photo ${index + 1}`}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ))}
                          {issue.photos.length > 3 && (
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-500">
                              +{issue.photos.length - 3}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => openStatusModal(issue)}
                      className="px-3 py-1 bg-brand-600 text-white text-sm rounded hover:bg-brand-700 flex items-center space-x-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Update Status</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {showStatusModal && currentIssue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Update Issue Status
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issue: {currentIssue.title}
                </label>
                <p className="text-sm text-gray-600">{currentIssue.description}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                >
                  {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment (Required)
                </label>
                <textarea
                  value={statusComment}
                  onChange={(e) => setStatusComment(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                  placeholder="Explain the action taken or reason for status change..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setStatusComment('');
                  setCurrentIssue(null);
                }}
                disabled={updating}
                className={`px-4 py-2 rounded ${updating ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'text-gray-700 bg-gray-200 hover:bg-gray-300'}`}
              >
                Cancel
              </button>
              <button
                onClick={() => handleStatusUpdate([currentIssue.id], newStatus as Issue['status'], statusComment)}
                disabled={!statusComment.trim() || updating}
                className={`px-4 py-2 text-white rounded ${(!statusComment.trim() || updating) ? 'bg-brand-400 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700'}`}
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};