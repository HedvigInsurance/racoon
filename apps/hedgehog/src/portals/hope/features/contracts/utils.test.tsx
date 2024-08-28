import {
  getFirstMasterInception,
  getLastTerminationDate,
} from '@hope/features/contracts/utils'

describe('getFirstMasterInception', () => {
  it('getFirstMasterInception returns first master inception if one contract is active', () => {
    const activeContracts = [
      {
        masterInception: '2020-01-01',
      },
    ]
    const firstMasterInception = getFirstMasterInception(activeContracts)
    expect(firstMasterInception).toStrictEqual('2020-01-01')
  })

  it('getFirstMasterInception returns null if one contract is pending', () => {
    const activeContracts = [
      {
        masterInception: null,
      },
    ]
    const firstMasterInception = getFirstMasterInception(activeContracts)
    expect(firstMasterInception).toStrictEqual(null)
  })

  it('getFirstMasterInception returns first master inception if both are active', () => {
    const activeContracts = [
      {
        masterInception: '2020-01-01',
      },
      {
        masterInception: '2020-03-01',
      },
    ]
    const firstMasterInception = getFirstMasterInception(activeContracts)
    expect(firstMasterInception).toStrictEqual('2020-01-01')
  })

  it('getFirstMasterInception returns first master inception in time if first contract is active', () => {
    const oneActiveOnePending = [
      {
        masterInception: '2020-01-01',
      },
      {
        masterInception: null,
      },
    ]
    const firstMasterInception = getFirstMasterInception(oneActiveOnePending)
    expect(firstMasterInception).toStrictEqual('2020-01-01')
  })

  it('getFirstMasterInception returns first master inception in time if second contract is active', () => {
    const oneActiveOnePending = [
      {
        masterInception: null,
      },
      {
        masterInception: '2020-01-01',
      },
    ]
    const firstMasterInception = getFirstMasterInception(oneActiveOnePending)
    expect(firstMasterInception).toStrictEqual('2020-01-01')
  })

  it('getFirstMasterInception returns null if both contracts are inactive', () => {
    const bothInactive = [
      {
        masterInception: null,
      },
      {
        masterInception: null,
      },
    ]
    const firstMasterInception = getFirstMasterInception(bothInactive)
    expect(firstMasterInception).toBe(null)
  })

  it('getFirstMasterInception returns null if no contract exists', () => {
    const firstMasterInception = getFirstMasterInception([])
    expect(firstMasterInception).toBe(null)
  })
})

describe('getLastTerminationDate', () => {
  it('getLastTerminationDate returns null if one contract is active', () => {
    const terminatedContracts = [
      {
        terminationDate: null,
      },
    ]
    const lastTerminationDate = getLastTerminationDate(terminatedContracts)
    expect(lastTerminationDate).toStrictEqual(null)
  })

  it('getLastTerminationDate returns last termination date in time if one contract is terminated', () => {
    const terminatedContracts = [
      {
        terminationDate: '2020-03-01',
      },
    ]
    const lastTerminationDate = getLastTerminationDate(terminatedContracts)
    expect(lastTerminationDate).toStrictEqual('2020-03-01')
  })

  it('getLastTerminationDate returns last termination date in time if second is terminated last', () => {
    const terminatedContracts = [
      {
        terminationDate: '2020-01-01',
      },
      {
        terminationDate: '2020-03-01',
      },
    ]
    const lastTerminationDate = getLastTerminationDate(terminatedContracts)
    expect(lastTerminationDate).toStrictEqual('2020-03-01')
  })

  it('getLastTerminationDate returns last termination date in time if first is terminated last', () => {
    const terminatedContracts = [
      {
        terminationDate: '2020-03-01',
      },
      {
        terminationDate: '2020-01-01',
      },
    ]
    const lastTerminationDate = getLastTerminationDate(terminatedContracts)
    expect(lastTerminationDate).toStrictEqual('2020-03-01')
  })

  it('getLastTerminationDate returns null first contract is active', () => {
    const oneActiveOneTerminated = [
      {
        terminationDate: null,
      },
      {
        terminationDate: '2020-03-01',
      },
    ]
    const lastTerminationDate = getLastTerminationDate(oneActiveOneTerminated)
    expect(lastTerminationDate).toBe(null)
  })

  it('getLastTerminationDate returns null if both contracts are active', () => {
    const bothInactive = [
      {
        terminationDate: null,
      },
      {
        terminationDate: null,
      },
    ]
    const lastTerminationDate = getLastTerminationDate(bothInactive)
    expect(lastTerminationDate).toBe(null)
  })

  it('getLastTerminationDate returns null if no contract exists', () => {
    const lastTerminationDate = getLastTerminationDate([])
    expect(lastTerminationDate).toBe(null)
  })
})
