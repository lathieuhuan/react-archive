import { COLORS, GENDERS, OCCUPATIONS } from "./constant";

type Color = typeof COLORS[number];

export interface PlainFormField {
  name: string;
  age: number | null;
  gender: typeof GENDERS[number];
  colors: Color[];
  occupation: typeof OCCUPATIONS[number] | null;
}

export interface NestedFormField {
  fullname: {
    firstname: string;
    lastname: string;
  };
  colors: Color[];
  socials: {
    type: string;
    url: string;
  }[];
}
