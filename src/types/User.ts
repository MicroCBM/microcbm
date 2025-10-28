interface AddUserPayload {
  user: {
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    status: string;
    phone: string;
    country: string;
    date_of_birth: string;
    role_id: string;
    organization: {
      id: string;
    };
    site: {
      id: string;
    };
  };
  password: string;
}

export type { AddUserPayload };
