export function getUserInitials(fullName: string): string {
  if (!fullName) return "";

  const words = fullName.trim().split(" ");
  const firstInitial = words[0]?.[0] || "";
  const lastInitial = words.length > 1 ? words[words.length - 1][0] : "";

  return `${firstInitial}${lastInitial}`.toUpperCase();
}
