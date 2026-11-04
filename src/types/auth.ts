export interface LoginResponse {
  id: string;
  token: string;
  accessToken?: string;
}

export interface RegisterTutorInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  administrativePin: string;
}
