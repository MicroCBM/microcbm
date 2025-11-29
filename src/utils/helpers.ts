export interface Region {
  name: string;
  shortCode: string;
}

export type DropdownOption = {
  label: string;
  value: string;
};

export interface CountryRegion {
  countryName: string;
  countryShortCode: string;
  regions: Region[];
}

const filterCountries = (
  countries: CountryRegion[],
  priorityCountries: string[],
  whitelist: string[],
  blacklist: string[]
): CountryRegion[] => {
  // eslint-disable-next-line prefer-const
  let countriesListedFirst: CountryRegion[] = [];
  let filteredCountries = countries;

  if (whitelist.length > 0) {
    filteredCountries = countries.filter(
      ({ countryShortCode }) => whitelist.indexOf(countryShortCode) > -1
    );
  } else if (blacklist.length > 0) {
    filteredCountries = countries.filter(
      ({ countryShortCode }) => blacklist.indexOf(countryShortCode) === -1
    );
  }

  if (priorityCountries.length > 0) {
    // ensure the countries are added in the order in which they are specified by the user
    priorityCountries.forEach((slug) => {
      const result = filteredCountries.find(
        ({ countryShortCode }) => countryShortCode === slug
      );
      if (result) {
        countriesListedFirst.push(result);
      }
    });

    filteredCountries = filteredCountries.filter(
      ({ countryShortCode }) =>
        priorityCountries.indexOf(countryShortCode) === -1
    );
  }

  return countriesListedFirst.length
    ? [...countriesListedFirst, ...filteredCountries]
    : filteredCountries;
};

const filterRegions = (
  regions: Region[],
  priorityRegions: string[],
  whitelist: string[],
  blacklist: string[]
) => {
  // eslint-disable-next-line prefer-const
  let regionsListedFirst: Region[] = [];
  let filteredRegions = regions;

  if (whitelist.length > 0) {
    filteredRegions = regions.filter(
      ({ shortCode }) => whitelist.indexOf(shortCode) > -1
    );
  } else if (blacklist.length > 0) {
    filteredRegions = regions.filter(
      ({ shortCode }) => blacklist.indexOf(shortCode) === -1
    );
  }

  if (priorityRegions.length > 0) {
    // ensure the Regions are added in the order in which they are specified by the user
    priorityRegions.forEach((slug) => {
      const result = filteredRegions.find(
        ({ shortCode }) => shortCode === slug
      );
      if (result) {
        regionsListedFirst.push(result);
      }
    });

    filteredRegions = filteredRegions.filter(
      ({ shortCode }) => priorityRegions.indexOf(shortCode) === -1
    );
  }

  return regionsListedFirst.length
    ? [...regionsListedFirst, ...filteredRegions]
    : filteredRegions;
};

const formatCurrency = (value: string) => {
  if (value && !isNaN(parseFloat(value))) {
    const formattedValue = parseFloat(value).toFixed(2);
    return formattedValue;
  }
};

function transformStrToDropdownOptions(strs: string[]) {
  const output: DropdownOption[] = [];
  for (const item of strs) {
    output.push({
      label: item.split("_").join(" "),
      value: item,
    });
  }

  return output;
}

function getTrendData(percentage: number) {
  const isPositive = percentage >= 0;
  const formattedPercentage = Math.abs(percentage).toFixed(1);
  const icon = isPositive ? "mdi:trending-up" : "mdi:trending-down";
  const label = `${
    isPositive ? "+" : ""
  }${formattedPercentage}% from last period`;

  return { icon, label, isPositive };
}

export {
  filterCountries,
  filterRegions,
  formatCurrency,
  transformStrToDropdownOptions,
  getTrendData,
};
