import { build as buildTsdown } from "tsdown";
import type { BundlerOptions } from "./BundlerOptions";

export const build = async (options: BundlerOptions) => {
	// Setup the project path
	const projectDir = `projects/${options.project}`;
	const entryFile = `${projectDir}/src/index.ts`;
	const outputDir = `${projectDir}/dist/tsdown`;

	// Build the project
	await buildTsdown({
		entry: entryFile,
		outDir: outputDir,
		format: options.cjs ? "cjs" : "esm",
		target: "esnext",
		clean: true,
		sourcemap: options.sourcemap ?? false,
		minify: options.minify ?? false,
		silent: true,
		dts: options.dts
			? {
					isolatedDeclarations: options.isolatedDeclarations ?? true,
				}
			: false,
	});
};
