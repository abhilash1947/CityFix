// Mock Authentication System for Local Development
interface MockUser {
  id: string;
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: string;
  created_at: string;
}

interface AuthResponse {
  data: { user: MockUser } | null;
  error: { message: string } | null;
}

// No bundled demo users in production-like mock mode
const DEMO_USERS: MockUser[] = [];

class MockAuthService {
  private currentUser: MockUser | null = null;
  private users: MockUser[] = [];

  constructor() {
    // Restore users and session from storage
    const savedUsers = localStorage.getItem('mockAuth_users');
    if (savedUsers) {
      this.users = JSON.parse(savedUsers);
    }
    // Check if user is already logged in
    const savedUser = localStorage.getItem('mockAuth_currentUser');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  async signUp(email: string, password: string, name: string, role: 'citizen' | 'authority' = 'citizen'): Promise<AuthResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user already exists in both demo users and registered users
    const existingDemoUser = DEMO_USERS.find(u => u.email === email);
    const existingUser = this.users.find(u => u.email === email);
    
    if (existingDemoUser || existingUser) {
      return { data: null, error: { message: 'User already exists with this email' } };
    }

    const newUser: MockUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
      role, // Allow role selection
      created_at: new Date().toISOString(),
    };

    this.users.push(newUser);
    localStorage.setItem('mockAuth_users', JSON.stringify(this.users));
    
    this.currentUser = newUser;
    localStorage.setItem('mockAuth_currentUser', JSON.stringify(newUser));
    // Notify listeners that mock auth state changed
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('mock-auth-changed'));
    }

    return { data: { user: newUser }, error: null };
  }

  async signIn(email: string, password: string): Promise<AuthResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Look up in registered users only
    const user = this.users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return {
        data: null,
        error: { message: 'Invalid login credentials' }
      };
    }

    this.currentUser = user;
    localStorage.setItem('mockAuth_currentUser', JSON.stringify(user));
    // Notify listeners that mock auth state changed
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('mock-auth-changed'));
    }

    return { data: { user }, error: null };
  }

  async signOut(): Promise<{ error: { message: string } | null }> {
    this.currentUser = null;
    localStorage.removeItem('mockAuth_currentUser');
    // Notify listeners that mock auth state changed
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('mock-auth-changed'));
    }
    return { error: null };
  }

  async resetPassword(email: string): Promise<{ error: { message: string } | null }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if email exists in registered users
    const user = this.users.find(u => u.email === email);
    
    if (!user) {
      return { error: { message: 'If this email exists in our system, you will receive password reset instructions.' } };
    }

    // In a real app, this would send an email
    // For demo purposes, show success message
    console.log(`Password reset email sent to ${email}`);
    console.log(`Your password is "${user.password}"`);
    
    return { error: null };
  }

  getCurrentUser(): MockUser | null {
    return this.currentUser;
  }

  getDemoCredentials(): { email: string; password: string }[] { return []; }
}

export const mockAuth = new MockAuthService();
export type { MockUser, AuthResponse };
