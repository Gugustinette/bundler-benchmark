import { build as buildRslib } from "@rslib/core";
import type { BundlerOptions } from "./BundlerOptions";

export const build = async (options: BundlerOptions) => {
	// Setup the project path
	const projectDir = `projects/${options.project}`;
	const entryFile = `${projectDir}/src/index.ts`;
	const entries = options.entries
		? options.entries.map((entry) => `${projectDir}/${entry}`)
		: undefined;
	const outputDir = `${projectDir}/dist/rslib`;

	// Build the project
	await buildRslib({
		lib: [
			{
				source: {
					entry: {
						index: entries ?? entryFile,
					},
					tsconfigPath: options.dts
						? `${projectDir}/rslib.tsconfig.json`
						: undefined,
				},
				format: options.cjs ? "cjs" : "esm",
				syntax: ["node 18"],
				dts: options.dts || false,
				output: {
					externals: options.external ?? undefined,
					minify: options.minify || false,
					sourceMap: options.sourcemap || false,
					distPath: {
						root: outputDir,
					},
					cleanDistPath: true,
				},
			},
		],
	});
};
