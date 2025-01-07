export enum ERROR {
  INVALID_SUPERKEY,   // Used when creating superusers
  
  // Error during the registration process
  INVALID_FIELDS,     // Missing/invalid fields
  USERNAME_EXISTS,

  // Authentication
  WRONG_PASS,         // Both non-existant users/wrong passwords

}