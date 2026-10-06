import React from 'react';
import { MapPin, Calendar } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Issue } from '../../lib/mockIssues';
import { ISSUE_CATEGORIES, STATUS_CONFIG } from '../../constants/categories';

interface IssueCardProps {
  issue: Issue;
  onClick?: () => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue, onClick }) => {
  const category = ISSUE_CATEGORIES.find(c => c.id === issue.category);
  const status = STATUS_CONFIG[issue.status];
  // Resolve icon components safely from lucide-react namespace
  const CategoryIcon = category ? (Icons as any)[category.icon] : null;
  const StatusIcon = (Icons as any)[status.icon];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {CategoryIcon && <CategoryIcon className="w-5 h-5 text-gray-600" />}
          <h3 className="text-lg font-semibold text-gray-900">{issue.title}</h3>
        </div>
        <div className="flex flex-col space-y-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${status.color}`}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {status.label}
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getUrgencyColor(issue.urgency)}`}>
            {issue.urgency.toUpperCase()}
          </span>
        </div>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-3">{issue.description}</p>

      {issue.photos && issue.photos.length > 0 && (
        <div className="mb-4">
          <div className="flex space-x-2 overflow-x-auto">
            {issue.photos.slice(0, 3).map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`Issue photo ${index + 1}`}
                className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
              />
            ))}
            {issue.photos.length > 3 && (
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-500">
                +{issue.photos.length - 3}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span className="truncate max-w-40">{issue.location.address}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(issue.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className={`px-2 py-1 rounded text-xs ${category?.color || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
          {category?.label || 'Unknown'}
        </div>
      </div>
    </div>
  );
};