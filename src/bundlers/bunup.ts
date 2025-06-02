import { exec } from "node:child_process";
import type { BundlerOptions } from "./BundlerOptions";

export const build = async (options: BundlerOptions) => {
	// Setup the project path
	const projectDir = `projects/${options.project}`;
	const entryFile = `${projectDir}/src/index.ts`;
	const outputDir = `${projectDir}/dist/bunup`;

	// Construct the bunup command
	let command = `bunx bunup --entry ${entryFile} --out-dir ${outputDir}`;

	// Add format option
	command += options.cjs ? " --format cjs" : " --format esm";

	// Add sourcemap option
	if (options.sourcemap) {
		command += " --sourcemap linked";
	}

	// Add minify option
	if (options.minify) {
		command += " --minify";
	}

	// Add silent option (bunup CLI has a --silent flag)
	command += " --silent";

	// Add dts options
	if (options.dts) {
		command += " --dts";
	}

	return new Promise<void>((resolve, reject) => {
		exec(command, (error, stdout, stderr) => {
			if (error) {
				console.error(`Error building project: ${error.message}`);
				console.error(`stderr: ${stderr}`);
				return reject(error);
			}
			if (stderr) {
				console.warn(`Warning during build: ${stderr}`);
			}
			resolve();
		});
	});
};
