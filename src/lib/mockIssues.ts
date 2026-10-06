// Mock Issue Storage for Local Development
interface Issue {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  urgency: 'low' | 'medium' | 'high';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  photos: string[];
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  created_at: string;
  updated_at: string;
}

class MockIssueService {
  private issues: Issue[] = [];

  constructor() {
    // Load existing issues from localStorage
    const savedIssues = localStorage.getItem('mockIssues');
    if (savedIssues) {
      this.issues = JSON.parse(savedIssues);
    }
  }

  private saveToStorage() {
    localStorage.setItem('mockIssues', JSON.stringify(this.issues));
  }

  async createIssue(issueData: Omit<Issue, 'id' | 'created_at' | 'updated_at' | 'status'>): Promise<{ data: Issue | null; error: any }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newIssue: Issue = {
      ...issueData,
      id: Date.now().toString(),
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.issues.push(newIssue);
    this.saveToStorage();

    return { data: newIssue, error: null };
  }

  async getIssues(userId?: string): Promise<{ data: Issue[] | null; error: any }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    let filteredIssues = this.issues;
    if (userId) {
      filteredIssues = this.issues.filter(issue => issue.user_id === userId);
    }

    return { data: filteredIssues, error: null };
  }

  async updateIssueStatus(issueId: string, status: Issue['status']): Promise<{ data: Issue | null; error: any }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const issueIndex = this.issues.findIndex(issue => issue.id === issueId);
    if (issueIndex === -1) {
      return { data: null, error: { message: 'Issue not found' } };
    }

    const oldStatus = this.issues[issueIndex].status;
    this.issues[issueIndex].status = status;
    this.issues[issueIndex].updated_at = new Date().toISOString();
    this.saveToStorage();

    // Notify user of status change
    const { mockNotificationService } = await import('./notifications');
    await mockNotificationService.notifyStatusUpdate(
      issueId,
      this.issues[issueIndex].title,
      oldStatus,
      status,
      this.issues[issueIndex].user_id
    );

    return { data: this.issues[issueIndex], error: null };
  }

  // Mock photo upload - converts File to base64 data URL
  async uploadPhoto(file: File): Promise<{ data: { publicUrl: string } | null; error: any }> {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          data: { publicUrl: reader.result as string },
          error: null
        });
      };
      reader.onerror = () => {
        resolve({
          data: null,
          error: { message: 'Failed to process image' }
        });
      };
      reader.readAsDataURL(file);
    });
  }
}

export const mockIssueService = new MockIssueService();
export type { Issue };
