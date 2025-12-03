import { CountryOption } from "../types";
import ReactCountryFlag from "react-country-flag"


export const COUNTRIES: CountryOption[] = [
  { 
    code: "GB", 
    label: "United Kingdom", 
    flag: <ReactCountryFlag countryCode="GB" svg style={{ width: '1.5em', height: '1.5em' }} />
  },
  { 
    code: "US", 
    label: "United States", 
    flag: <ReactCountryFlag countryCode="US" svg style={{ width: '1.5em', height: '1.5em' }} />
  },
  { 
    code: "FR", 
    label: "France", 
    flag: <ReactCountryFlag countryCode="FR" svg style={{ width: '1.5em', height: '1.5em' }} />
  },
  { 
    code: "DE", 
    label: "Germany", 
    flag: <ReactCountryFlag countryCode="DE" svg style={{ width: '1.5em', height: '1.5em' }} />
  },
  { 
    code: "ES", 
    label: "Spain", 
    flag: <ReactCountryFlag countryCode="ES" svg style={{ width: '1.5em', height: '1.5em' }} />
  },
  { 
    code: "IT", 
    label: "Italy", 
    flag: <ReactCountryFlag countryCode="IT" svg style={{ width: '1.5em', height: '1.5em' }} />
  },
];