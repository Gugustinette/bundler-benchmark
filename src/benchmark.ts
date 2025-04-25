import { build as buildUnbuild } from './bundlers/unbuild';
import { build as buildTsup } from './bundlers/tsup';
import { build as buildTsdown } from './bundlers/tsdown';
import { TimeUtil } from './util/TimeUtil';

const benchmark = async () => {
  // unbuild
  const unbuildExecutionTime = await TimeUtil.getTimeExecutionFor(() =>
    buildUnbuild({
      project: 'thousand-functions',
    })
  );
  // tsup
  const tsupExecutionTime = await TimeUtil.getTimeExecutionFor(() =>
    buildTsup({
      project: 'thousand-functions',
    })
  );
  // tsdown
  const tsdownExecutionTime = await TimeUtil.getTimeExecutionFor(() =>
    buildTsdown({
      project: 'thousand-functions',
    })
  );
  // Log the results
  console.log(`[unbuild]: Built project in ${unbuildExecutionTime.toFixed(2)} ms`);
  console.log(`[tsup]: Built project in ${tsupExecutionTime.toFixed(2)} ms`);
  console.log(`[tsdown]: Built project in ${tsdownExecutionTime.toFixed(2)} ms`);
};

benchmark().catch((err) => {
  console.error('Error during benchmark:', err);
});
