export interface ApiResponse<T> {
  status: string;
  statusCode: number;
  message: string;
  data: T;
  url: string;
}

export interface UserData {
  token: string;
  email: string;
  id: number;
  first_name: string;
  last_name: string;
}

export interface RegisterResponse {
  user: {
    id: number;
    email: string;
  };
  token: string;
}

export type LoginResponse = {
  status: string;
  statusCode: number;
  message: string;
  data: {
    token: string;
    email: string;
    id: number;
    first_name: string;
    last_name: string;
  };
  url: string;
};
