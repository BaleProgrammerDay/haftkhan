/**
 * Calculates the typing speed (delay between characters) based on text length and desired duration
 * @param text - The text to be typed
 * @param desiredTimeMs - The desired total time in milliseconds
 * @returns The speed (delay in milliseconds) between each character
 */
export const calculateTypingSpeed = (text: string, desiredTimeMs: number): number => {
  if (!text || text.length === 0) {
    return 0;
  }
  
  if (desiredTimeMs <= 0) {
    return 0;
  }
  
  return Math.round(desiredTimeMs / text.length);
};

/**
 * Calculates typing speed with minimum and maximum bounds
 * @param text - The text to be typed
 * @param desiredTimeMs - The desired total time in milliseconds
 * @param minSpeed - Minimum speed (maximum delay) in milliseconds
 * @param maxSpeed - Maximum speed (minimum delay) in milliseconds
 * @returns The speed (delay in milliseconds) between each character, bounded by min and max
 */
export const calculateTypingSpeedBounded = (
  text: string, 
  desiredTimeMs: number, 
  minSpeed: number = 50, 
  maxSpeed: number = 1000
): number => {
  const calculatedSpeed = calculateTypingSpeed(text, desiredTimeMs);
  return Math.max(minSpeed, Math.min(maxSpeed, calculatedSpeed));
};
