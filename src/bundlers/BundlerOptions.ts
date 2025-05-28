export interface BundlerOptions {
	/**
	 * The name of the project to bundle.
	 */
	project?: string;
	// General bundler options
	cjs?: boolean;
	minify?: boolean;
	sourcemap?: boolean;
	dts?: boolean;
	isolatedDeclarations?: boolean;
}
