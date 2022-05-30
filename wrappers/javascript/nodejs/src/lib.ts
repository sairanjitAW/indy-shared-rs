import { Library } from 'ffi-napi'
import fs from 'fs'
import os from 'os'
import path from 'path'

import { nativeBindings } from './ffi'

const LIBNAME = 'indy_credx'
const ENV_VAR = 'LIB_INDY_CREDX_PATH'

type Platform = 'darwin' | 'linux' | 'win32'

type ExtensionMap = Record<Platform, { prefix?: string; extension: string }>

const extensions: ExtensionMap = {
  darwin: { prefix: 'lib', extension: '.dylib' },
  linux: { prefix: 'lib', extension: '.so' },
  win32: { extension: '.dll' },
}

const libPaths: Record<Platform, Array<string>> = {
  darwin: ['/usr/local/lib/', '/usr/lib/', '/opt/homebrew/opt/'],
  linux: ['/usr/lib/', '/usr/local/lib/'],
  win32: ['c:\\windows\\system32\\'],
}

// Alias for a simple function to check if the path exists
const doesPathExist = fs.existsSync

const getLibrary = () => {
  // Detect OS; darwin, linux and windows are only supported
  const platform = os.platform()

  if (platform !== 'linux' && platform !== 'win32' && platform !== 'darwin')
    throw new Error(`Unsupported platform: ${platform}. linux, win32 and darwin are supported.`)

  // Get a potential path from the environment variable
  const pathFromEnvironment = process.env[ENV_VAR]

  // Get the paths specific to the users operating system
  const platformPaths = libPaths[platform]

  // Check if the path from the environment variable is supplied and add it
  // We use unshift here so that when we want to get a valid library path this will be the first to resolve
  if (pathFromEnvironment) platformPaths.unshift(pathFromEnvironment)

  // Create the path + file
  const libcredx = platformPaths.map((p) =>
    path.join(p, `${extensions[platform].prefix ?? ''}${LIBNAME}${extensions[platform].extension}`)
  )

  // Gaurd so we quit if there is no valid path for the library
  if (!libcredx.some(doesPathExist))
    throw new Error(`Could not find ${LIBNAME} with these paths: ${libcredx.join(' ')}`)

  // Get the first valid library
  // Casting here as a string because there is a guard of none of the paths
  const validLibraryPath = libcredx.find((l) => doesPathExist(l)) as string

  console.log(validLibraryPath)

  // TODO
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return Library(validLibraryPath, nativeBindings)
}

interface NativeMethods {
  credx_version(): string
  credx_get_current_error(ret: Buffer): number
}

// @ts-ignore
export const nativeIndyCredx = getLibrary() as NativeMethods
