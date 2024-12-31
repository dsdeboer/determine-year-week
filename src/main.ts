import * as core from '@actions/core'
import { getISOWeek, getWeekYear } from 'date-fns'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  const date_value: string = core.getInput('current_date')
  core.debug(`Date value given '${date_value}'`)
  const dateNow = date_value ? new Date(date_value) : new Date()
  const releaseName = `release/${getWeekYear(dateNow)}-${String(getISOWeek(dateNow)).padStart(2, '0')}`
  core.debug(`Date value parsed '${releaseName}'`)
  core.setOutput('release_name', releaseName)
  return Promise.resolve()
}
