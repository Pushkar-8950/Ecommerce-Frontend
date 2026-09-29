export const calculateExpiryStatus = (validUntilDate) => {
  if (!validUntilDate) return 'EXPIRED';

  const now = new Date();
  const validUntil = new Date(validUntilDate);
  const diffTime = validUntil.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      status: 'EXPIRED',
      daysRemaining: diffDays,
      isExpiringSoon: false,
      isExpired: true,
      label: 'Expired',
    };
  } else if (diffDays <= 30) {
    return {
      status: 'EXPIRING_SOON',
      daysRemaining: diffDays,
      isExpiringSoon: true,
      isExpired: false,
      label: `Expiring in ${diffDays} days`,
    };
  } else {
    return {
      status: 'VALID',
      daysRemaining: diffDays,
      isExpiringSoon: false,
      isExpired: false,
      label: `Valid for ${diffDays} days`,
    };
  }
};
