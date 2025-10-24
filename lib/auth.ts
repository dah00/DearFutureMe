import { supabase } from "./supabase";

// Types for our authentication functions
export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: any;
}

/**
 * Authentication Service
 *
 * Handles all authentication operations with Supabase.
 */
export class AuthService {
  /**
   * Sign up a new user
   *
   * What happens:
   * 1. Supabase creates a new user account
   * 2. Sends verification email (if email confirmation is enabled)
   * 3. Returns user data or error
   */
  static async signUp({
    email,
    password,
    fullName,
  }: SignUpData): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName, 
          },
        },
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  }

  /**
   * Sign in an existing user
   *
   * What happens:
   * 1. Supabase validates email/password
   * 2. Creates a session token
   * 3. Returns user data or error
   */
  static async signIn({ email, password }: SignInData): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  }

  /**
   * Sign out the current user
   */
  static async signOut(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  }

  /**
   * Get the current user session
   *
   */
  static async getCurrentUser() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      return null;
    }
  }

  /**
   * Listen to authentication state changes
   *
   */
  static onAuthStateChange(callback: (user: any) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user ?? null);
    });
  }
}
