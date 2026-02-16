export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  [key: string]: string; // allows dynamic fields from schema
}

export type UserFormData = Omit<User, 'id'>;
