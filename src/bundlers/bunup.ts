import { build as buildBunup } from "bunup";
import type { BundlerOptions } from "./BundlerOptions";

export const build = async (options: BundlerOptions) => {
	// Setup the project path
	const projectDir = `projects/${options.project}`;
	const entryFile = `${projectDir}/src/index.ts`;
	const entries = options.entries
		? options.entries.map((entry) => `${projectDir}/${entry}`)
		: undefined;
	const outputDir = `${projectDir}/dist/bunup`;

	// Build the project
	await buildBunup({
		entry: entries ?? entryFile,
		external: options.external ?? undefined,
		outDir: outputDir,
		format: [options.cjs ? "cjs" : "esm"],
		clean: true,
		sourcemap: options.sourcemap ?? false,
		minify: options.minify ?? false,
		silent: true,
		dts: options.dts ?? false,
	});
};
