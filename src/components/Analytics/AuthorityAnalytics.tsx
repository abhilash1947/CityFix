import React, { useEffect, useMemo, useState } from 'react';
import { mockIssueService, Issue } from '../../lib/mockIssues';
import { STATUS_CONFIG } from '../../constants/categories';
import { CalendarDays, BarChart3, TrendingUp } from 'lucide-react';

export const AuthorityAnalytics: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await mockIssueService.getIssues();
        setIssues(data || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const stats = useMemo(() => {
    const byStatus: Record<string, number> = {};
    const byMonth: Record<string, number> = {};
    let total = issues.length;
    for (const i of issues) {
      byStatus[i.status] = (byStatus[i.status] || 0) + 1;
      const dt = new Date(i.created_at);
      const key = `${dt.getFullYear()}-${(dt.getMonth() + 1).toString().padStart(2, '0')}`;
      byMonth[key] = (byMonth[key] || 0) + 1;
    }
    const monthKeys = Object.keys(byMonth).sort();
    const recent = monthKeys.slice(-6);
    return { total, byStatus, byMonth: recent.reduce((a, k) => ({ ...a, [k]: byMonth[k] }), {}) };
  }, [issues]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto"></div>
        <p className="text-gray-600 mt-2">Loading analytics…</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-brand-600" /> Analytics
        </h1>
        <p className="text-gray-600">Overview of issue volume and resolution progress</p>
      </div>

      {/* Top cards */}
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
        {Object.entries(STATUS_CONFIG).slice(0,3).map(([key, cfg]) => (
          <div key={key} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{cfg.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.byStatus[key] || 0}</p>
              </div>
              <CalendarDays className="w-8 h-8 text-gray-400" />
            </div>
          </div>
        ))}
      </div>

      {/* Monthly bar chart (simple CSS bars) */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Issues per Month</h2>
        {Object.keys(stats.byMonth).length === 0 ? (
          <div className="text-center text-gray-500 py-8">No monthly data yet.</div>
        ) : (
          <div className="flex items-end gap-4 h-40">
            {Object.entries(stats.byMonth).map(([month, count]) => (
              <div key={month} className="flex flex-col items-center justify-end">
                <div
                  className="w-8 bg-gradient-to-t from-brand-300 to-brand-600 rounded-md transition-all"
                  style={{ height: `${Math.min(100, (count as number) * 12)}%` }}
                  title={`${month}: ${count}`}
                />
                <span className="mt-2 text-xs text-gray-600">{month}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
