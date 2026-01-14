interface User {
  roles?: string[];
  permissions?: string[];
}

export function hasRole(user: User | null | undefined, roles: string[]) {
  return !!user && roles.some((r) => user.roles?.includes(r));
}

export function hasPermission(user: User | null | undefined, perms: string[]) {
  return !!user && perms.some((p) => user.permissions?.includes(p));
}
