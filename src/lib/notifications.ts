// Mock Notification System for Local Development
interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'status_update' | 'new_issue' | 'system';
  read: boolean;
  created_at: string;
  issue_id?: string;
}

class MockNotificationService {
  private notifications: Notification[] = [];

  constructor() {
    // Load existing notifications from localStorage
    const savedNotifications = localStorage.getItem('mockNotifications');
    if (savedNotifications) {
      this.notifications = JSON.parse(savedNotifications);
    }
  }

  private saveToStorage() {
    localStorage.setItem('mockNotifications', JSON.stringify(this.notifications));
  }

  async createNotification(notificationData: Omit<Notification, 'id' | 'created_at' | 'read'>): Promise<void> {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      read: false,
      created_at: new Date().toISOString(),
    };

    this.notifications.push(newNotification);
    this.saveToStorage();

    // Show browser notification if permission granted
    if (Notification.permission === 'granted') {
      new Notification(notificationData.title, {
        body: notificationData.message,
        icon: '/favicon.ico'
      });
    }
  }

  async getNotifications(userId: string): Promise<{ data: Notification[] | null; error: any }> {
    const userNotifications = this.notifications
      .filter(n => n.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return { data: userNotifications, error: null };
  }

  async markAsRead(notificationId: string): Promise<{ error: any }> {
    const notificationIndex = this.notifications.findIndex(n => n.id === notificationId);
    if (notificationIndex !== -1) {
      this.notifications[notificationIndex].read = true;
      this.saveToStorage();
    }
    return { error: null };
  }

  async markAllAsRead(userId: string): Promise<{ error: any }> {
    this.notifications = this.notifications.map(n => 
      n.user_id === userId ? { ...n, read: true } : n
    );
    this.saveToStorage();
    return { error: null };
  }

  // Request notification permission
  async requestPermission(): Promise<boolean> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  // Send status update notification to issue reporter
  async notifyStatusUpdate(issueId: string, issueTitle: string, oldStatus: string, newStatus: string, reporterUserId: string): Promise<void> {
    await this.createNotification({
      user_id: reporterUserId,
      title: 'Issue Status Updated',
      message: `Your issue "${issueTitle}" has been updated from ${oldStatus} to ${newStatus}`,
      type: 'status_update',
      issue_id: issueId
    });
  }
}

export const mockNotificationService = new MockNotificationService();
export type { Notification };
