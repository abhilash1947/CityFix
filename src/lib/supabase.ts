import { createClient } from '@supabase/supabase-js';
import { mockAuth } from './mockAuth';



const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key:", supabaseAnonKey?.substring(0, 10) + "...");

// Check if we should use mock authentication
const useMockAuth = !supabaseUrl || !supabaseAnonKey || 
    supabaseUrl.includes('placeholder') || supabaseUrl.includes('your-project') ||
    supabaseAnonKey.includes('placeholder') || supabaseAnonKey.includes('your-anon-key');

// Using mock authentication when Supabase env is not configured

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      headers: {
        apikey: supabaseAnonKey || 'placeholder-key',
        Authorization: `Bearer ${supabaseAnonKey || 'placeholder-key'}`,
      },
    },
  }
);


// Auth helpers
export const signUp = async (email: string, password: string, metadata: any) => {
  if (useMockAuth) {
    return await mockAuth.signUp(email, password, metadata.name, metadata.role);
  }
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  if (useMockAuth) {
    return await mockAuth.signIn(email, password);
  }
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    // If we get a network error due to invalid configuration
    if (error && error.message.includes('fetch')) {
      return { 
        data: null, 
        error: { 
          message: 'Configuration Error: Please set up your Supabase credentials in the .env file. Check the console for details.' 
        } 
      };
    }
    
    return { data, error };
  } catch (err) {
    console.error('Network error:', err);
    return { 
      data: null, 
      error: { 
        message: 'Network Error: Unable to connect to authentication service. Please check your internet connection and Supabase configuration.' 
      } 
    };
  }
};

export const signOut = async () => {
  if (useMockAuth) {
    return await mockAuth.signOut();
  }
  
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const resetPassword = async (email: string) => {
  if (useMockAuth) {
    return await mockAuth.resetPassword(email);
  }
  
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  return { error };
};

// Get current user
export const getCurrentUser = () => {
  if (useMockAuth) {
    return mockAuth.getCurrentUser();
  }
  return null; // Would normally get from supabase.auth.getUser()
};

// Get demo credentials for development
export const getDemoCredentials = () => {
  if (useMockAuth) {
    return mockAuth.getDemoCredentials();
  }
  return [];
};