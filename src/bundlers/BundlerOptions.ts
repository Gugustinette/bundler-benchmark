export interface BundlerOptions {
	/**
	 * The name of the project to bundle.
	 */
	project?: string;
	// General bundler options
	minify?: boolean;
	sourcemap?: boolean;
	dts?: boolean;
	isolatedDeclarations?: boolean;
}
