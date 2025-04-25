import { benchmark as benchmarkUnbuild } from './bundlers/unbuild';
import { benchmark as benchmarkTsup } from './bundlers/tsup';
import { benchmark as benchmarkTsdown } from './bundlers/tsdown';

const benchmark = async () => {
  // unbuild
  await benchmarkUnbuild();
  // tsup
  await benchmarkTsup();
  // tsdown
  await benchmarkTsdown();
};

benchmark().catch((err) => {
  console.error('Error during benchmark:', err);
});
