import Cookies from 'js-cookie';

type StorableValue = string | number | boolean | Date | object | any[];

const serialize = (value: StorableValue): string => {
  if (value instanceof Date) {
    return JSON.stringify({ __type: 'Date', value: value.toISOString() });
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
};

const deserialize = <T>(value: string): T => {
  try {
    const parsed = JSON.parse(value);

    // Handle serialized Date
    if (parsed?.__type === 'Date' && parsed.value) {
      return new Date(parsed.value) as unknown as T;
    }

    return parsed as T;
  } catch {
    // It's a plain string or number
    if (!isNaN(Number(value))) return Number(value) as unknown as T;
    return value as unknown as T;
  }
};

// Set cookie with automatic type handling
export const setCookie = (
  key: string,
  value: StorableValue,
  options?: Cookies.CookieAttributes
): void => {
  const serialized = serialize(value);
  Cookies.set(key, serialized, { expires: 7, ...options });
};

// Get cookie with automatic type restoration
export const getCookie = <T = any>(key: string): T | undefined => {
  const value = Cookies.get(key);
  if (!value) return undefined;
  return deserialize<T>(value);
};

export const removeCookie = (key: string, options?: Cookies.CookieAttributes): void => {
  Cookies.remove(key, options);
};

export const hasCookie = (key: string): boolean => {
  return Cookies.get(key) !== undefined;
};
