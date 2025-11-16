export interface User {
  id: number;
  created_at: Date;
  name: string;
  email: string;
  password: Password;
  activated: boolean;
  version: number;
}

interface Password {
  hash: string;
  plaintext: string;
}
