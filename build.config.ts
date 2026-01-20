/**
 * Build configuration for React Console applications
 * Provides configuration for bundling, compilation, and optimization
 */

export interface BuildConfig {
  /** Entry point file */
  entry?: string;
  /** Output directory */
  outDir?: string;
  /** Output format (cjs, esm, umd) */
  format?: 'cjs' | 'esm' | 'umd';
  /** Minify output */
  minify?: boolean;
  /** Generate source maps */
  sourcemap?: boolean | 'inline' | 'external';
  /** Bundle external dependencies */
  bundle?: boolean;
  /** Target platform */
  target?: string;
  /** Tree-shaking enabled */
  treeshake?: boolean;
  /** External dependencies to exclude from bundle */
  external?: string[];
  /** Define global variables */
  define?: Record<string, string>;
  /** Platform-specific options */
  platform?: 'node' | 'browser';
  /** CLI-specific options */
  cli?: {
    /** Create executable output */
    executable?: boolean;
    /** Executable bundler (pkg, nexe, esbuild) */
    bundler?: 'pkg' | 'nexe' | 'esbuild';
    /** Application name for executable */
    name?: string;
    /** Application version */
    version?: string;
    /** Application description */
    description?: string;
    /** Icon path (if supported) */
    icon?: string;
    /** Target platforms for executable */
    targets?: Array<'linux' | 'macos' | 'windows'>;
  };
}

/**
 * Default build configuration
 */
export const defaultBuildConfig: BuildConfig = {
  entry: './src/index.ts',
  outDir: './dist',
  format: 'cjs',
  minify: false,
  sourcemap: true,
  bundle: true,
  target: 'node18',
  treeshake: true,
  external: [],
  platform: 'node',
};

/**
 * Merge build configurations
 */
export function mergeBuildConfig(
  base: BuildConfig,
  override: Partial<BuildConfig>
): BuildConfig {
  return {
    ...base,
    ...override,
    cli: override.cli ? { ...base.cli, ...override.cli } : base.cli,
    define: override.define ? { ...base.define, ...override.define } : base.define,
    external: override.external ? [...(base.external || []), ...override.external] : base.external,
  };
}

/**
 * Validate build configuration
 */
export function validateBuildConfig(config: BuildConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!config.entry) {
    errors.push('Entry point is required');
  }

  if (!config.outDir) {
    errors.push('Output directory is required');
  }

  if (config.format && !['cjs', 'esm', 'umd'].includes(config.format)) {
    errors.push(`Invalid format: ${config.format}. Must be 'cjs', 'esm', or 'umd'`);
  }

  if (config.cli?.bundler && !['pkg', 'nexe', 'esbuild'].includes(config.cli.bundler)) {
    errors.push(`Invalid bundler: ${config.cli.bundler}. Must be 'pkg', 'nexe', or 'esbuild'`);
  }

  if (config.cli?.executable && !config.cli.bundler) {
    errors.push('Bundler is required when creating executable');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
