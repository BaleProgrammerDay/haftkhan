// 4
// 3

export const shouldShowTimeoutModal = (
  attemptHistory: number,
  maxAttempts: number
) => {
  if (attemptHistory > maxAttempts && (attemptHistory - maxAttempts) % 2 == 1) {
    return true;
  }
  return false;
};

