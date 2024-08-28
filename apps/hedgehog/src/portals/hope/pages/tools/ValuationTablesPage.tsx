import { useEffect, useMemo, useRef, useState } from 'react'
import * as React from 'react'
import {
  Button,
  convertEnumToTitle,
  Dropdown,
  DropdownOption,
  extractErrorMessage,
  Flex,
  Input,
  isPressing,
  Keys,
  MainHeadline,
  Modal,
  MultiDropdown,
  SecondLevelHeadline,
  Spinner,
  TextArea,
  TextDatePicker,
  useConfirmDialog,
  usePlatform,
  useTitle,
} from '@hedvig-ui'
import { InsuranceType } from '@hope/features/config/constants'
import gql from 'graphql-tag'
import {
  ListValuationTablesDocument,
  ListValuationTablesQuery,
  useAddValuationRulesetMutation,
  useAddValuationTableMutation,
  useListItemTypesQuery,
  useListValuationTablesQuery,
  useUpsertItemRulesetMutation,
  useUpsertValuationRuleMutation,
  ValuationTable,
} from 'types/generated/graphql'
import { toast } from 'react-hot-toast'
import styled from '@emotion/styled'

const TermsTableRowRegex =
  /([A-ZÅÄÖÆØ][a-zA-Z\n\s,.åäöæøÅÄÖÆØ*()/\-+]+)(\d+)[\s\t\n](\d+)[\s\t\n](\d+)[\s\t\n](\d+)[\s\t\n](\d+)[\s\t\n](\d+)[\s\t\n](\d+)[\s\t\n](\d+)[\s\t\n](\d+)[\s\t\n](\d+)[\s\t\n]?(\d+)?/g

gql`
  query ListValuationTables {
    valuationTables {
      ...ValuationTable
    }
  }

  query ListItemTypes {
    itemModelTypes {
      name
      displayName
    }
  }

  mutation AddValuationTable(
    $insuranceType: String!
    $appliesFrom: Date!
    $termsTableString: String
  ) {
    valuationTable_addTable(
      insuranceType: $insuranceType
      appliesFrom: $appliesFrom
      termsTableString: $termsTableString
    ) {
      ...ValuationTable
    }
  }

  mutation AddValuationRuleset($tableId: ID!, $name: String!) {
    valuationTable_addRuleset(tableId: $tableId, name: $name) {
      ...ValuationTable
    }
  }

  mutation UpsertValuationRule(
    $rulesetId: ID!
    $ageFrom: BigDecimal!
    $depreciation: BigDecimal!
  ) {
    valuationTable_upsertRule(
      rulesetId: $rulesetId
      ageFrom: $ageFrom
      depreciation: $depreciation
    ) {
      ...ValuationTable
    }
  }

  mutation UpsertItemRuleset($rulesetId: ID!, $itemType: String!) {
    valuationTable_upsertItemRuleset(
      rulesetId: $rulesetId
      itemType: $itemType
    ) {
      ...ValuationTable
    }
  }

  fragment ValuationTable on ValuationTable {
    id
    insuranceType
    appliesFrom
    rulesets {
      id
      name
      rules {
        id
        ageFrom
        depreciation
      }
      itemTypes
    }
  }
`

const useValuationTableMutations = () => {
  const { confirm } = useConfirmDialog()
  const { data: { itemModelTypes } = {} } = useListItemTypesQuery()
  const itemTypes = itemModelTypes ?? []

  const [addValuationTableMutation] = useAddValuationTableMutation()
  const [addValuationRulesetMutation] = useAddValuationRulesetMutation()
  const [upsertValuationRuleMutation] = useUpsertValuationRuleMutation()
  const [upsertItemRulesetMutation] = useUpsertItemRulesetMutation()
  const addValuationTable = async (
    insuranceType: string,
    appliesFrom: string | null,
    termsTableString: string | null,
  ) => {
    if (!appliesFrom) return
    await confirm(
      `Add a new valuation table for ${convertEnumToTitle(
        insuranceType,
      )} that applies from ${appliesFrom}?`,
    )
    return toast.promise(
      addValuationTableMutation({
        variables: {
          insuranceType,
          appliesFrom,
          termsTableString: termsTableString ? termsTableString : null,
        },
        update: (cache, { data }) => {
          const newTable = data?.valuationTable_addTable
          if (!newTable) return
          const cachedTables =
            (
              cache.readQuery({
                query: ListValuationTablesDocument,
              }) as ListValuationTablesQuery
            )?.valuationTables ?? []
          cache.writeQuery({
            query: ListValuationTablesDocument,
            data: {
              valuationTables: [...cachedTables, newTable],
            },
          })
        },
      }),
      {
        success: 'Table added',
        loading: 'Adding table...',
        error: ({ message }) => extractErrorMessage(message),
      },
    )
  }

  const addValuationRuleset = async (
    valuationTable: ValuationTable,
    name: string | null,
  ) => {
    if (!name || !valuationTable) return
    await confirm(
      `Add a new valuation ruleset for ${convertEnumToTitle(
        valuationTable.insuranceType,
      )} with name "${name}"?`,
    )
    await toast.promise(
      addValuationRulesetMutation({
        variables: {
          tableId: valuationTable.id,
          name,
        },
      }),
      {
        success: 'Ruleset added',
        loading: 'Adding ruleset...',
        error: ({ message }) => extractErrorMessage(message),
      },
    )
  }

  const upsertValuationRule = async (
    rulesetId: string,
    ageFrom: string,
    depreciation?: string,
  ) => {
    if (!depreciation) return
    return upsertValuationRuleMutation({
      variables: {
        rulesetId,
        ageFrom: ageFrom,
        depreciation: (+depreciation / 100).toFixed(2),
      },
    })
  }

  const upsertItemRuleset = async (rulesetId: string, itemType: string) => {
    await upsertItemRulesetMutation({
      variables: {
        rulesetId,
        itemType,
      },
    })
  }
  return {
    addValuationTable,
    addValuationRuleset,
    upsertValuationRule,
    upsertItemRuleset,
    itemTypes,
  }
}

const useValuationTables = () => {
  const defaultInsuranceType = Object.values(InsuranceType)[0]
  const [insuranceType, setInsuranceType] =
    useState<string>(defaultInsuranceType)
  const [valuationTableId, setValuationTableId] = useState<string | null>(null)
  const {
    data: { valuationTables: allValuationTables } = {},
    loading: loadingValuationTables,
  } = useListValuationTablesQuery()
  const valuationTables = useMemo(
    () =>
      allValuationTables?.filter(
        (table: ValuationTable) => table.insuranceType === insuranceType,
      ) ?? [],
    [allValuationTables, insuranceType],
  )

  const valuationTableCounts =
    useMemo(() => {
      return allValuationTables?.reduce<Record<string, number>>(
        (prev, curr) => {
          prev[curr.insuranceType] = prev[curr.insuranceType]
            ? prev[curr.insuranceType] + 1
            : 1
          return prev
        },
        {} as Record<string, number>,
      )
    }, [allValuationTables]) ?? {}

  const valuationTable = useMemo(() => {
    if (!valuationTables.length) {
      return null
    }
    const currentTable = valuationTables.find(
      (table) => table.id === valuationTableId,
    )
    return currentTable ?? valuationTables[0]
  }, [valuationTableId, valuationTables])

  useEffect(() => {
    setValuationTableId(valuationTable?.id ?? null)
  }, [valuationTable])

  return {
    loading: loadingValuationTables,
    insuranceType,
    setInsuranceType,
    valuationTable,
    setValuationTableId,
    valuationTables,
    valuationTableCounts,
  }
}

const ageFroms: ReadonlyArray<string> = [
  '0.0',
  '0.5',
  '1.0',
  '2.0',
  '3.0',
  '4.0',
  '5.0',
  '6.0',
  '7.0',
  '8.0',
  '9.0',
]

const Wrapper = styled.div`
  padding: 2rem;
`

const EditingInput = styled(Input)<{ length: number }>`
  border: none;
  background-color: transparent;
  padding: 0;
  font-size: inherit;
  letter-spacing: inherit;
  margin: auto;
  width: ${({ length }) => (!length ? '2' : length)}ch;
`

const Table = styled.table`
  border-collapse: collapse;
  tbody td {
    background-color: white;
    border: 1px solid black;
    padding: 0.1rem 0.25rem;
  }
  thead th {
    border: 1px solid black;
    padding: 0.5rem 0;
  }
  tr {
    padding-left: 0.2rem;
  }
  border-spacing: 0;
`

const ValuationRule: React.FC<{
  rulesetId: string
  ageFrom: string
  currentDepreciation?: number
  upsertRule: (
    rulesetId: string,
    ageFrom: string,
    depreciation?: string,
  ) => Promise<unknown>
}> = ({ rulesetId, ageFrom, currentDepreciation, upsertRule }) => {
  const startDepreciation = useMemo(
    () =>
      currentDepreciation !== undefined ? currentDepreciation / 0.01 + '' : '',
    [currentDepreciation],
  )
  const [depreciation, setDepreciation] = useState<string>(startDepreciation)
  const ruleRef = useRef<HTMLInputElement>(null)
  return (
    <EditingInput
      type="number"
      ref={ruleRef}
      length={depreciation.length}
      maxLength={3}
      value={depreciation}
      onChange={({ currentTarget: { value } }) => setDepreciation(value)}
      onKeyDown={(e) => {
        if (!isPressing(e, Keys.Enter)) return
        ruleRef.current?.blur()
      }}
      onBlur={() => {
        if (depreciation === undefined) return
        upsertRule(rulesetId, ageFrom, depreciation).catch(({ message }) => {
          toast.error(extractErrorMessage(message))
          setDepreciation(startDepreciation)
          ruleRef.current?.focus()
        })
      }}
    />
  )
}

const TableHeader: React.FC = () => {
  return (
    <thead style={{ textAlign: 'left' }}>
      <tr>
        <th style={{ padding: '0 0.25rem', width: '17rem' }} key="name">
          Name
        </th>
        {ageFroms.map((ageFrom) => (
          <th
            key={ageFrom}
            style={{
              width: '3.5rem',
              minWidth: '3.5rem',
              textAlign: 'center',
            }}
          >
            {+ageFrom} yr
          </th>
        ))}
        <th style={{ padding: '0 0.5rem' }}>Item types</th>
      </tr>
    </thead>
  )
}

interface Highlight {
  itemType: string
  itemAge?: string
}

export const ValuationTableComponent: React.FC<{
  valuationTable: ValuationTable
  highlights?: Highlight[]
  editable?: boolean
}> = ({ valuationTable, highlights = [], editable = false }) => {
  const nameRef = useRef<HTMLInputElement>(null)

  const [rulesetName, setRulesetName] = useState<string>('')
  const { isMetaKey } = usePlatform()
  const {
    addValuationRuleset,
    upsertValuationRule,
    itemTypes,
    upsertItemRuleset,
  } = useValuationTableMutations()

  const highlightCells = highlights?.map((highlight) => {
    const age = highlight?.itemAge
    const ageFrom = age
      ? ageFroms
          .slice()
          .reverse()
          .find((from) => +from <= +age)
      : undefined
    return {
      ageFrom,
      itemType: highlight?.itemType,
    }
  })

  return (
    <>
      <SecondLevelHeadline>
        {convertEnumToTitle(valuationTable.insuranceType)} |{' '}
        <strong>{valuationTable.appliesFrom}</strong>
      </SecondLevelHeadline>
      <Table>
        <TableHeader />
        <tbody>
          {valuationTable.rulesets.map((ruleset) => (
            <tr key={ruleset.id} style={{ position: 'relative' }}>
              <td key={ruleset.name}>{ruleset.name}</td>
              {ageFroms.map((ageFrom) => {
                const ruleMaybe = ruleset.rules.find(
                  (rule) => rule.ageFrom === +ageFrom,
                )
                const highlightType = highlightCells?.some(
                  (cell) =>
                    !cell.ageFrom &&
                    cell.itemType &&
                    ruleset.itemTypes.includes(cell.itemType),
                )
                const highlightBoth = highlightCells.some(
                  (cell) =>
                    cell.itemType &&
                    ruleset.itemTypes.includes(cell.itemType) &&
                    cell.ageFrom === ageFrom,
                )
                return (
                  <td
                    key={ageFrom}
                    style={
                      highlightBoth
                        ? { backgroundColor: '#290958', color: 'white' }
                        : highlightType
                          ? { backgroundColor: '#be9bf3' }
                          : {}
                    }
                  >
                    {editable ? (
                      <ValuationRule
                        rulesetId={ruleset.id}
                        ageFrom={ageFrom}
                        currentDepreciation={ruleMaybe?.depreciation}
                        upsertRule={upsertValuationRule}
                      ></ValuationRule>
                    ) : (
                      <div style={{ margin: '0 auto', width: 'min-content' }}>
                        {ruleMaybe?.depreciation !== undefined
                          ? ruleMaybe?.depreciation / 0.01
                          : ''}
                      </div>
                    )}
                  </td>
                )
              })}
              <td>
                <MultiDropdown
                  tabIndex={-1}
                  style={{
                    width: 'max-content',
                    marginRight: '2rem',
                  }}
                  placeholder="Item types..."
                  options={itemTypes.map((itemType) => itemType.name)}
                  value={ruleset.itemTypes}
                  onChange={(itemType) =>
                    upsertItemRuleset(ruleset.id, itemType)
                  }
                  clearHandler={() => {
                    ruleset.itemTypes.map((itemType) =>
                      upsertItemRuleset(ruleset.id, itemType),
                    )
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {editable && (
        <Input
          ref={nameRef}
          placeholder="Add new ruleset..."
          value={rulesetName}
          style={{ width: '17rem' }}
          onChange={({ currentTarget: { value } }) => setRulesetName(value)}
          onKeyDown={async (e) => {
            if (!isMetaKey(e) || !isPressing(e, Keys.Enter)) return
            await addValuationRuleset(valuationTable, rulesetName)
            setRulesetName('')
            nameRef.current?.focus()
          }}
        ></Input>
      )}
    </>
  )
}

const ValuationTablesPage = () => {
  useTitle('Valuation Tables')

  const {
    loading,
    insuranceType,
    setInsuranceType,
    valuationTable,
    setValuationTableId,
    valuationTables,
    valuationTableCounts,
  } = useValuationTables()
  const { addValuationTable } = useValuationTableMutations()
  const [appliesFrom, setAppliesFrom] = useState<string | null>(null)
  const [termsTableString, setTermsTableString] = useState<string | null>(null)
  const [addingTable, setAddingTable] = useState(false)

  if (loading) {
    return <Spinner />
  }

  return (
    <Wrapper>
      <Flex direction="column" gap="small" style={{ paddingRight: '4rem' }}>
        <MainHeadline>Valuation tables</MainHeadline>
        <Flex justify="space-between">
          <Dropdown style={{ width: '17rem' }}>
            {Object.values(InsuranceType).map((type) => (
              <DropdownOption
                key={type}
                value={type}
                onClick={() => setInsuranceType(type)}
                selected={type === insuranceType}
              >
                {convertEnumToTitle(type)} ({valuationTableCounts[type] ?? 0})
              </DropdownOption>
            ))}
          </Dropdown>

          <div>
            <Flex gap="small">
              <TextDatePicker
                value={appliesFrom}
                onChange={(date) => setAppliesFrom(date)}
                placeholder="Applies from"
              />
              <Button
                disabled={!appliesFrom}
                onClick={() => setAddingTable(true)}
              >
                Add new +
              </Button>
            </Flex>
          </div>
        </Flex>
        <Dropdown style={{ width: '17rem' }} placeholder="No valuation table">
          {valuationTables.map((table) => (
            <DropdownOption
              key={table.id}
              onClick={() => setValuationTableId(table.id)}
              selected={valuationTable?.id === table.id}
            >
              {table.appliesFrom}
            </DropdownOption>
          ))}
        </Dropdown>
        {valuationTable && (
          <ValuationTableComponent valuationTable={valuationTable} editable />
        )}
      </Flex>
      <Modal
        onClose={() => {
          setAppliesFrom(null)
          setTermsTableString(null)
          setAddingTable(false)
        }}
        visible={addingTable}
      >
        <Flex
          direction="column"
          align="center"
          gap="medium"
          style={{ padding: '2rem' }}
        >
          <MainHeadline>
            {convertEnumToTitle(insuranceType)} | <strong>{appliesFrom}</strong>
          </MainHeadline>
          {(!termsTableString ||
            !termsTableString.match(TermsTableRowRegex)) && (
            <TextArea
              placeholder="Paste table from terms here.."
              onChange={({ currentTarget: { value } }) =>
                setTermsTableString(value)
              }
            />
          )}
          {termsTableString && termsTableString.match(TermsTableRowRegex) && (
            <Table>
              <TableHeader />
              <tbody>
                {Array.from(termsTableString.matchAll(TermsTableRowRegex)).map(
                  (group) => (
                    <tr key={group.index}>
                      {group.slice(1).map((value, index) => (
                        <td
                          key={index}
                          style={{ textAlign: index ? 'center' : undefined }}
                        >
                          {value}
                        </td>
                      ))}
                      <td key="noop" />
                    </tr>
                  ),
                )}
              </tbody>
            </Table>
          )}
          <div>
            <Flex gap="small">
              <Button
                onClick={() => setTermsTableString(null)}
                variant="tertiary"
              >
                Reset
              </Button>
              <Button
                onClick={async () => {
                  const newTable = await addValuationTable(
                    insuranceType,
                    appliesFrom,
                    termsTableString,
                  )
                  setValuationTableId(
                    newTable?.data?.valuationTable_addTable?.id ?? null,
                  )
                }}
              >
                Submit
              </Button>
            </Flex>
          </div>
        </Flex>
      </Modal>
    </Wrapper>
  )
}

export default ValuationTablesPage
