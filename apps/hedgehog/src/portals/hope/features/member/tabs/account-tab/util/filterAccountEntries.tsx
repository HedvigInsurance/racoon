import { AccountEntryV2 } from 'types/generated/graphql'

export function filterOutAccountEntriesWithCancelledContract(
  entries: AccountEntryV2[],
): AccountEntryV2[] {
  // Group entries by type and then by a unique key
  const entriesByType = groupEntriesByType(entries)
  const typeGroups = groupEntriesByUniqueKey(entriesByType)

  // Sum amounts for each group and return the new array of entries
  return sumAmountsInGroups(typeGroups).filter((e) => e.amount !== '0')
}

function groupEntriesByType(
  entries: AccountEntryV2[],
): Record<string, AccountEntryV2[]> {
  const types = ['DISCOUNT', 'SETTLEMENT_ADJUSTMENT', 'CARRIED_ADJUSTMENT']
  return entries.reduce(
    (acc: Record<string, AccountEntryV2[]>, entry: AccountEntryV2) => {
      const type = types.includes(entry.type) ? entry.type : 'OTHER'
      if (!acc[type]) {
        acc[type] = []
      }
      acc[type].push(entry)
      return acc
    },
    {},
  )
}

function groupEntriesByUniqueKey(
  entriesByType: Record<string, AccountEntryV2[]>,
): Record<string, Record<string, AccountEntryV2[]>> {
  return Object.entries(entriesByType).reduce(
    (acc, [type, entries]) => {
      acc[type] = entries.reduce(
        (groupAcc, entry) => {
          const key = createGroupKey(entry, type)
          if (!groupAcc[key]) {
            groupAcc[key] = []
          }
          groupAcc[key].push(entry)
          return groupAcc
        },
        {} as Record<string, AccountEntryV2[]>,
      )
      return acc
    },
    {} as Record<string, Record<string, AccountEntryV2[]>>,
  )
}

function sumAmountsInGroups(
  typeGroups: Record<string, Record<string, AccountEntryV2[]>>,
): AccountEntryV2[] {
  return Object.values(typeGroups).flatMap((groups) => {
    return Object.values(groups).map((groupEntries) => {
      const newEntry = { ...groupEntries[0] }
      newEntry.amount = groupEntries
        .reduce((sum, entry) => {
          return sum + parseFloat(entry.amount)
        }, 0)
        .toString()
      return newEntry
    })
  })
}

// Helper function to create a unique key for grouping
const createGroupKey = (entry: AccountEntryV2, type: string) =>
  type === 'DISCOUNT'
    ? `${entry.chargeDueDate}${entry.subtype}`
    : `${entry.chargeDueDate}${entry.instalment?.insuranceType ?? ''}${
        entry.subtype
      }`
