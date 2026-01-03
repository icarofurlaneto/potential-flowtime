/**
 * Simple wrapper for localStorage with type safety.
 */
export const storage = {
  get: (key: string, defaultValue: string = ''): string => {
    return localStorage.getItem(key) || defaultValue;
  },
  getNumber: (key: string, defaultValue: number = 0): number => {
    const val = localStorage.getItem(key);
    return val ? parseInt(val, 10) : defaultValue;
  },
  getBoolean: (key: string, defaultValue: boolean = false): boolean => {
    const val = localStorage.getItem(key);
    return val !== null ? val === 'true' : defaultValue;
  },
  set: (key: string, value: string | number | boolean): void => {
    localStorage.setItem(key, value.toString());
  }
};
