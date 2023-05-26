export interface AuthorizableUser<Roles = string, Id = string, Email = string> {
  id: Id;
  email: Email;
  roles: Array<Roles>;
}
