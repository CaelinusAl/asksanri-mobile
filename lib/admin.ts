type UserLike = { role?: string; email?: string } | null | undefined;

const ADMIN_EMAILS = [
  "selin@asksanri.com",
  "admin@asksanri.com",
  "selin@caelinusai.com",
  "caelinusai.asksanri@gmail.com",
];

export function isAdmin(user: UserLike): boolean {
  if (user?.role === "admin") return true;
  const email = user?.email?.trim().toLowerCase();
  if (email && ADMIN_EMAILS.includes(email)) return true;
  return false;
}
