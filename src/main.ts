import * as core from '@actions/core'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  const dateNow = new Date()
  core.setOutput('return_value', dateNow.toTimeString())
  return Promise.resolve()
}
