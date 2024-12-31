/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as main from '../src/main'

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

// Other utilities
const timeRegex = /^release\/\d{4}-\d{2}/

// Mock the GitHub Actions core library
let debugMock: jest.SpiedFunction<typeof core.debug>
let errorMock: jest.SpiedFunction<typeof core.error>
let getInputMock: jest.SpiedFunction<typeof core.getInput>
let setOutputMock: jest.SpiedFunction<typeof core.setOutput>

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    debugMock = jest.spyOn(core, 'debug').mockImplementation()
    errorMock = jest.spyOn(core, 'error').mockImplementation()
    getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
    setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()
  })

  it('sets the time output', async () => {
    await main.run()
    expect(runMock).toHaveReturned()

    expect(setOutputMock).toHaveBeenNthCalledWith(
      1,
      'release_name',
      expect.stringMatching(timeRegex)
    )
    expect(errorMock).not.toHaveBeenCalled()
  })

  it.each([
    ['2024-12-31', 'release/2025-01'],
    ['2024-12-01', 'release/2024-48'],
    ['2025-01-01', 'release/2025-01'],
    ['2025-01-31', 'release/2025-05']
  ])('sets the correct time output `%s`', async (date_value, result) => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'current_date':
          return date_value
        default:
          return ''
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()
    expect(debugMock).toHaveBeenNthCalledWith(
      1,
      `Date value given '${date_value}'`
    )
    expect(debugMock).toHaveBeenNthCalledWith(
      2,
      `Date value parsed '${result}'`
    )

    expect(setOutputMock).toHaveBeenNthCalledWith(
      1,
      'release_name',
      expect.stringMatching(timeRegex)
    )
    expect(errorMock).not.toHaveBeenCalled()
  })

  it('sets a failed status', async () => {
    await main.run()
    expect(runMock).toHaveReturned()

    expect(errorMock).not.toHaveBeenCalled()
  })
})
