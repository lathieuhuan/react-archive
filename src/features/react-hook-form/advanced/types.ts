export type FormData = {
  firstName: string;
  lastName: string;
  dob: Date;
  gender: "MALE" | "FEMALE" | "OTHER";
  occupation: string;
  socialMedias: Array<{
    type: "FACEBOOK" | "INSTAGRAM";
    link: string;
  }>;
};
