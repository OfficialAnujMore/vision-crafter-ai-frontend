export interface GoogleAuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    google_id: string;
    email: string;
    name: string;
    picture: string | null;
    is_active: boolean;
    created_at: string;
  };
}