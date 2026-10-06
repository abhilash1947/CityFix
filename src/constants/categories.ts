import { CategoryInfo } from '../types';

export const ISSUE_CATEGORIES: CategoryInfo[] = [
  {
    id: 'roads',
    label: 'Roads & Transportation',
    icon: 'Construction',
    description: 'Potholes, broken streetlights, traffic signals',
    color: 'bg-orange-100 text-orange-800 border-orange-200'
  },
  {
    id: 'waste',
    label: 'Waste Management',
    icon: 'Trash2',
    description: 'Garbage collection, littering, illegal dumping',
    color: 'bg-green-100 text-green-800 border-green-200'
  },
  {
    id: 'water',
    label: 'Water Supply',
    icon: 'Droplets',
    description: 'Water leaks, pressure issues, quality concerns',
    color: 'bg-brand-100 text-brand-800 border-brand-200'
  },
  {
    id: 'electricity',
    label: 'Electricity',
    icon: 'Zap',
    description: 'Power outages, faulty connections, street lighting',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  },
  {
    id: 'safety',
    label: 'Public Safety',
    icon: 'Shield',
    description: 'Unsafe conditions, security concerns, emergencies',
    color: 'bg-red-100 text-red-800 border-red-200'
  },
  {
    id: 'others',
    label: 'Others',
    icon: 'MoreHorizontal',
    description: 'Other municipal issues not listed above',
    color: 'bg-gray-100 text-gray-800 border-gray-200'
  }
];

export const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: 'Clock'
  },
  in_progress: {
    label: 'In Progress',
    color: 'bg-brand-100 text-brand-800 border-brand-200',
    icon: 'Wrench'
  },
  resolved: {
    label: 'Resolved',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: 'CheckCircle'
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: 'XCircle'
  }
};