
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: Record<string, any>;
  app_metadata?: Record<string, any>;
}

export interface AuthSession {
  user: AuthUser;
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
}

export interface OnboardingData {
  id: string;
  status: 'draft' | 'submitted' | 'pending' | 'approved' | 'rejected';
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}
