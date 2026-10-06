export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'citizen' | 'authority';
  created_at: string;
}

export interface Issue {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  photos: string[];
  created_at: string;
  updated_at: string;
  urgency: 'low' | 'medium' | 'high';
  assigned_to?: string;
}

export interface StatusUpdate {
  id: string;
  issue_id: string;
  old_status: IssueStatus;
  new_status: IssueStatus;
  comment: string;
  updated_by: string;
  before_photos?: string[];
  after_photos?: string[];
  created_at: string;
}

export type IssueCategory = 
  | 'roads' 
  | 'waste' 
  | 'water' 
  | 'electricity' 
  | 'safety' 
  | 'others';

export type IssueStatus = 'pending' | 'in_progress' | 'resolved';

export interface CategoryInfo {
  id: IssueCategory;
  label: string;
  icon: string;
  description: string;
  color: string;
}