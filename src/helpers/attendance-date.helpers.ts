export function convertToAttendanceDateString(date: Date): string {
  const year = date.getFullYear();
  // getMonth() is zero-based (0 = January), so add 1
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return year + month + day;
}