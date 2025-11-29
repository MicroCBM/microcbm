interface CountryRegion {
  countryName: string;
  countryShortCode: string;
  regions: Region[];
}

interface Region {
  name: string;
  shortCode: string;
}

interface SessionUser {
  user_id: string;
  email: string;
  role: string;
  role_id: string;
  permissions: string[];
  org_id: string;
  exp: number;
  iat: number;
}

type DropdownOption = {
  label: string;
  value: string;
};

export type { CountryRegion, Region, SessionUser, DropdownOption };
