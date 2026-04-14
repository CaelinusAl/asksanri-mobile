type UserLike = { role?: string } | null | undefined;

export function isAdmin(user: UserLike): boolean {
  return user?.role === "admin";
}
