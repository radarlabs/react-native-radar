import Radar from './NativeRadar';

export function getItem(key: string): string | null {
  return Radar.getItem(key);
}

export function setItem(key: string, value: string): void {
  return Radar.setItem(value, key);
}

export function removeItem(key: string): void {
  return Radar.removeItem(key);
}

export function clear(): void {
  return Radar.clear();
}

export default Radar;
