/**
 * Utility class for common operations
 */
export class CommonUtil {
	/**
	 * Deeply merges objects together, preserving nested properties
	 * @param target The target object
	 * @param sources One or more source objects to merge
	 * @returns The merged object
	 */
	// biome-ignore lint/suspicious/noExplicitAny: Required for generic deep merge utility
	static deepMerge<T extends Record<string, any>>(
		target: T,
		...sources: Partial<T>[]
	): T {
		if (!sources.length) return target;

		const source = sources.shift();
		if (!source) return target;

		for (const key in source) {
			if (
				source[key] &&
				typeof source[key] === "object" &&
				!Array.isArray(source[key])
			) {
				if (!target[key] || typeof target[key] !== "object") {
					// biome-ignore lint/suspicious/noExplicitAny: Required for generic deep merge utility
					target[key] = {} as any;
				}
				CommonUtil.deepMerge(
					// biome-ignore lint/suspicious/noExplicitAny: Required for generic deep merge utility
					target[key] as Record<string, any>,
					// biome-ignore lint/suspicious/noExplicitAny: Required for generic deep merge utility
					source[key] as Record<string, any>,
				);
			} else if (source[key] !== undefined) {
				target[key] = source[key];
			}
		}

		return CommonUtil.deepMerge(target, ...sources);
	}
}
