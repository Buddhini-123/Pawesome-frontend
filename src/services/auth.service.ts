import { User, LoginCredentials, RegisterData } from '../types';
import { mockDb } from './mockDb';
import { v4 as uuidv4 } from 'uuid';

interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  private currentUser: User | null = null;
  private token: string | null = null;

  constructor() {
    // Load auth data from localStorage on initialization
    this.loadAuthData();
  }

  private loadAuthData() {
    try {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('auth_user');
      
      if (token && userData) {
        this.token = token;
        this.currentUser = JSON.parse(userData);
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
      this.clearAuthData();
    }
  }

  private saveAuthData(user: User, token: string) {
    this.currentUser = user;
    this.token = token;
    
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
  }

  private clearAuthData() {
    this.currentUser = null;
    this.token = null;
    
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('cart'); // Clear cart on logout
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { email, password, rememberMe } = credentials;
    
    // Validate input
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Trim whitespace from email
    const trimmedEmail = email.trim().toLowerCase();
    
    console.log('Login attempt:', { email: trimmedEmail, password });

    // Check if user exists
    const user = await mockDb.findUserByEmail(trimmedEmail);
    
    console.log('User found:', user);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // In a real app, we'd verify the password hash
    // For demo, accept specific passwords for demo accounts
    let validPassword = false;
    
    if (trimmedEmail === 'demo@pawsome.com') {
      validPassword = password === 'demo123';
    } else if (trimmedEmail === 'admin@pawsome.com') {
      validPassword = password === 'admin123';
    } else {
      // For any other user, accept this default password
      validPassword = password === 'password123';
    }
    
    console.log('Password validation:', { trimmedEmail, expectedPassword: trimmedEmail === 'admin@pawsome.com' ? 'admin123' : 'other', providedPassword: password, validPassword });
    
    if (!validPassword) {
      throw new Error('Invalid email or password');
    }

    // Generate token
    const token = uuidv4();
    const sessionId = await mockDb.createSession(user.id);
    
    // Save auth data
    this.saveAuthData(user, token);
    
    // If remember me is checked, set longer expiry
    if (rememberMe) {
      // In a real app, this would be handled server-side
      console.log('Remember me enabled');
    }

    return { user, token };
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const { name, email, password, phone } = data;
    
    // Validate input
    if (!name || !email || !password) {
      throw new Error('Name, email, and password are required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    // Validate password strength
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    // Check if user already exists
    const existingUser = await mockDb.findUserByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user
    const newUser = await mockDb.createUser({
      email,
      name,
      phone,
      role: 'user',
      addresses: []
    });

    // Generate token
    const token = uuidv4();
    const sessionId = await mockDb.createSession(newUser.id);
    
    // Save auth data
    this.saveAuthData(newUser, token);

    return { user: newUser, token };
  }

  async logout(): Promise<void> {
    // Clear auth data
    this.clearAuthData();
    
    // In a real app, we'd also invalidate the token server-side
    return Promise.resolve();
  }

  async getCurrentUser(): Promise<User | null> {
    if (!this.currentUser || !this.token) {
      return null;
    }

    // Verify token is still valid (in real app, check with server)
    // For now, just return the cached user
    return this.currentUser;
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    if (!this.currentUser) {
      throw new Error('No user logged in');
    }

    // Update user in database
    const updatedUser = await mockDb.updateUser(this.currentUser.id, updates);
    
    // Update local cache
    this.currentUser = updatedUser;
    localStorage.setItem('auth_user', JSON.stringify(updatedUser));

    return updatedUser;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    if (!this.currentUser) {
      throw new Error('No user logged in');
    }

    // Validate current password (demo password)
    if (currentPassword !== 'password123') {
      throw new Error('Current password is incorrect');
    }

    // Validate new password
    if (newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters long');
    }

    // In a real app, we'd update the password hash in the database
    console.log('Password changed successfully');
  }

  async refreshToken(): Promise<string> {
    if (!this.token) {
      throw new Error('No token to refresh');
    }

    // In a real app, this would exchange the current token for a new one
    // For now, just return the same token
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser && !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }

  getUserRole(): 'user' | 'admin' | null {
    return this.currentUser?.role || null;
  }

  // Helper method to check if user has a specific role
  hasRole(role: 'user' | 'admin'): boolean {
    return this.currentUser?.role === role;
  }

  // Helper method to get user initials for avatar
  getUserInitials(): string {
    if (!this.currentUser) return '';
    
    const names = this.currentUser.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  }
}

// Create singleton instance
export const authService = new AuthService();