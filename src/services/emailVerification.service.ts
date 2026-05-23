import { api } from './api';

export interface EmailVerificationStatus {
  is_verified: boolean;
  email: string;
  verified_at: string | null;
}

export interface EmailVerificationResponse {
  success: boolean;
  message: string;
}

export interface EmailVerificationStatusResponse {
  success: boolean;
  data: EmailVerificationStatus;
}

class EmailVerificationService {
  /**
   * Send initial verification email to authenticated user
   */
  async sendVerificationEmail(): Promise<EmailVerificationResponse> {
    const response = await api.post<EmailVerificationResponse>('/email/verify/send');

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to send verification email');
    }

    return response.data as EmailVerificationResponse;
  }

  /**
   * Verify email using URL parameters from verification link
   */
  async verifyEmail(
    userId: string | number,
    hash: string,
    expires: string,
    signature: string
  ): Promise<EmailVerificationResponse> {
    // Build the URL with query parameters
    const endpoint = `/email/verify?id=${userId}&hash=${hash}&expires=${expires}&signature=${signature}`;
    const response = await api.get<EmailVerificationResponse>(endpoint);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Email verification failed');
    }

    return response.data as EmailVerificationResponse;
  }

  /**
   * Resend verification email to authenticated user
   */
  async resendVerificationEmail(): Promise<EmailVerificationResponse> {
    const response = await api.post<EmailVerificationResponse>('/email/verify/resend');

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to resend verification email');
    }

    return response.data as EmailVerificationResponse;
  }

  /**
   * Check current verification status for authenticated user
   */
  async getVerificationStatus(): Promise<EmailVerificationStatus> {
    const response = await api.get<EmailVerificationStatusResponse>('/email/verify/status');

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get verification status');
    }

    // Handle double-wrapped response
    const data = response.data as any;
    if (data.data) {
      return data.data as EmailVerificationStatus;
    }

    return data as EmailVerificationStatus;
  }
}

export const emailVerificationService = new EmailVerificationService();
