export const timeAgo = (timestamp: Date): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const differenceInMilliseconds = now.getTime() - date.getTime();
  
  const differenceInMinutes = Math.floor(differenceInMilliseconds / (1000 * 60));
  const differenceInHours = Math.floor(differenceInMilliseconds / (1000 * 60 * 60));
  const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
  const differenceInWeeks = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24 * 7));
  const differenceInYears = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24 * 365));
  
  if (differenceInMinutes < 1) {
    return 'Just now';
  } else if (differenceInMinutes < 60) {
    return `${differenceInMinutes}m`;
  } else if (differenceInHours < 24) {
    return `${differenceInHours}h`;
  } else if (differenceInDays < 7) {
    return `${differenceInDays}d`;
  } else if (differenceInWeeks < 52) {
    return `${differenceInWeeks}w`;
  } else {
    return `${differenceInYears}y`;
  }
};
