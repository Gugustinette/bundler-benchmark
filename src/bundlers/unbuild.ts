import { build as buildUnbuild } from "unbuild";
import type { BundlerOptions } from "./BundlerOptions";

export const build = async (options: BundlerOptions) => {
	// Setup the project path
	const projectDir = `projects/${options.project}`;
	const entryFile = "src/index.ts";
	const outputDir = "dist/unbuild";

	// Build the project
	await buildUnbuild(projectDir, false, {
		entries: [entryFile],
		outDir: outputDir,
		clean: true,
		sourcemap: options.sourcemap || false,
		declaration: options.dts ? "node16" : false,
		rollup: {
			emitCJS: false,
			esbuild: {
				minify: options.minify || false,
				target: "esnext",
				format: options.cjs ? "cjs" : "esm",
			},
		},
	});
};
