export interface RegisterEntity {
  name: string;
  email: string;
  passwordHash: string;
  roleName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
