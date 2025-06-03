import { build as buildTsup } from "tsup";
import type { BundlerOptions } from "./BundlerOptions";

export const build = async (options: BundlerOptions) => {
	// Setup the project path
	const projectDir = `projects/${options.project}`;
	const entryFile = `${projectDir}/src/index.ts`;
	const entries = options.entries
		? options.entries.map((entry) => `${projectDir}/${entry}`)
		: undefined;
	const outputDir = `${projectDir}/dist/tsup`;

	// Build the project
	await buildTsup({
		entry: entries ?? [entryFile],
		outDir: outputDir,
		format: options.cjs ? "cjs" : "esm",
		target: "esnext",
		clean: true,
		sourcemap: options.sourcemap || false,
		minify: options.minify || false,
		silent: true,
		dts: options.dts || false,
	});
};
