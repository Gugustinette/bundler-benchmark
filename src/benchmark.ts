import { benchmark as benchmarkTsdown } from './bundlers/tsdown';
import { benchmark as benchmarkTsup } from './bundlers/tsup';
import { benchmark as benchmarkUnbuild } from './bundlers/unbuild';

const benchmark = async () => {
  // tsdown
  // benchmarkTsdown();
  // tsup
  // benchmarkTsup();
  // unbuild
  benchmarkUnbuild();
};

benchmark().catch((err) => {
  console.error('Error during benchmark:', err);
});
