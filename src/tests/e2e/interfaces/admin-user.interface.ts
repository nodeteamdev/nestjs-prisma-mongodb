export interface AdminUserInterface {
  id: string;
  email: string | null;
  phone: string | null;
  password: string | null;
  accessToken: string;
  refreshToken: string;
}
