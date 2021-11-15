import { log } from '@create-figma-plugin/common'

import { BuildOptions } from './types/build.js'
import { buildBundlesAsync } from './utilities/build-bundles-async/build-bundles-async.js'
import { buildManifestAsync } from './utilities/build-manifest-async.js'
import { trackElapsedTime } from './utilities/track-elapsed-time.js'
import { typeCheckBuild } from './utilities/type-check/type-check-build.js'

export async function buildAsync(
  options: BuildOptions & { clearPreviousLine: boolean }
): Promise<void> {
  const { minify, typecheck, clearPreviousLine } = options
  try {
    if (typecheck === true) {
      const getTypeCheckElapsedTime = trackElapsedTime()
      log.info('Type checking...')
      typeCheckBuild()
      const typeCheckElapsedTime = getTypeCheckElapsedTime()
      log.success(`Type checked in ${typeCheckElapsedTime}`, {
        clearPreviousLine
      })
      log.info('Building...')
      const getBuildElapsedTime = trackElapsedTime()
      await Promise.all([buildBundlesAsync(minify), buildManifestAsync(minify)])
      const buildElapsedTime = getBuildElapsedTime()
      log.success(`Built in ${buildElapsedTime}`, { clearPreviousLine })
    } else {
      log.info('Building...')
      const getBuildElapsedTime = trackElapsedTime()
      await Promise.all([
        buildBundlesAsync(minify),
        buildManifestAsync(minify)
      ])
      const buildElapsedTime = getBuildElapsedTime()
      log.success(`Built in ${buildElapsedTime}`, { clearPreviousLine })
    }
  } catch (error: any) {
    log.error(error.message)
    process.exit(1)
  }
}
