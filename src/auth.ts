export enum ROLES {
  ADMIN,      // Admin has no route restriction what so ever
  GUESTS,     // Gusts can only view public pages and other pages on spcial occasions
  VISITOR,    // Visitors can only view public pages
  PREVIEW
}

export enum PERMISSIONS {
  READ,
  CREATE,
  MODIFY
}