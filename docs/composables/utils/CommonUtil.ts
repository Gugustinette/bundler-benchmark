/**
 * Deeply merges objects together, preserving nested properties
 * @param target The target object 
 * @param sources One or more source objects to merge
 * @returns The merged object
 */
export function deepMerge<T extends Record<string, any>>(target: T, ...sources: Partial<T>[]): T {
  if (!sources.length) return target;
  
  const source = sources.shift();
  if (!source) return target;

  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key] || typeof target[key] !== 'object') {
        target[key] = {} as any;
      }
      deepMerge(target[key] as Record<string, any>, source[key] as Record<string, any>);
    } else if (source[key] !== undefined) {
      target[key] = source[key];
    }
  }

  return deepMerge(target, ...sources);
}
