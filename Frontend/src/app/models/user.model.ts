export interface User {
  username: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  aadhaar: string;
  role: 'customer' | 'admin';
  password?: string;
} 