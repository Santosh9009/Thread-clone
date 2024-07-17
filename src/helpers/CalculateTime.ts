export const timeAgo = (timestamp: Date): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const differenceInMilliseconds = now.getTime() - date.getTime();
  const differenceInHours = Math.floor(differenceInMilliseconds / (1000 * 60 * 60));

  if (differenceInHours === 0) {
    const differenceInMinutes = Math.floor(differenceInMilliseconds / (1000 * 60));
    if (differenceInMinutes === 0) {
      return 'Just now';
    }
    return `${differenceInMinutes} m`;
  }

  return `${differenceInHours} h`;
};