import styled from '@emotion/styled'
import {
  convertEnumOrSentenceToTitle,
  convertEnumToTitle,
  Label,
  lightTheme,
  MultiDropdown,
  Navigation,
  Popover,
  useConfirmDialog,
} from '@hedvig-ui'
import {
  TextDatePicker,
  Tooltip,
  Flex,
  CheckboxInput,
} from '@hedvig-ui/redesign'
import { ClaimOutcomes } from '@hope/features/claims/claim-details/ClaimInformation/components/SubclaimOutcomeDropdown'
import {
  ClaimState,
  Market,
  MarketFlags,
  InsuranceType,
} from '@hope/features/config/constants'
import { useMe } from '@hope/features/user/hooks/use-me'
import { useState } from 'react'
import * as React from 'react'
import { BookmarkX, InfoCircle } from 'react-bootstrap-icons'
import { useNavigate } from 'react-router-dom'
import { useHasPermission } from '@hope/common/hooks/use-has-permission'
import {
  UpdateUserSettingInput,
  useGetClaimTypesQuery,
  useListClaimAssignedAdminsQuery,
  useUnassignClaimsFromAdminMutation,
} from 'types/generated/graphql'
import toast from 'react-hot-toast'

export const FilterWrapper = styled.div`
  width: 100%;
  max-width: 1500px;

  display: grid;
  grid-template-columns: repeat(7, 1fr);
  column-gap: 3rem;
  align-items: flex-start;
  margin: 2rem 0;
`

export const FilterElement = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.7rem;

  & label {
    margin: 0;
  }
`

export const StyledLabel = styled(Label)`
  width: 100%;

  display: flex;
  align-items: center;

  & span {
    margin-right: 1em;
  }

  & svg {
    width: 15px;
    height: 15px;

    &:hover {
      cursor: help;
    }
  }
`

const ColorBadge = styled.div`
  display: inline-block;
  width: 1.5em;
  height: 1.5em;
  border-radius: 2px;
  vertical-align: center;
  margin-left: 0.5rem;
`

interface OutcomeFilterProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect' | 'onChange'> {
  outcomes?: string[] | null
  onSelect: (value: string | null) => void
  open: boolean
  multi: boolean
}

const OutcomeFilter: React.FC<OutcomeFilterProps> = ({
  outcomes,
  onSelect,
  open,
  ...props
}) => {
  const options = [
    ...Object.keys(ClaimOutcomes).map((value) => ({
      value,
      text: convertEnumToTitle(value),
    })),
    { value: 'not_specified', text: 'Not specified' },
  ]

  return (
    <MultiDropdown
      value={outcomes?.map((item) => convertEnumToTitle(item)) || null}
      open={open}
      options={options.map((opt) => opt.text)}
      placeholder="Outcome filter"
      onChange={(value) => {
        const selectedValue = options.filter((opt) => opt.text === value)[0]
        onSelect(selectedValue.value)
      }}
      clearHandler={() => onSelect(null)}
      style={{ minWidth: '10rem', ...props.style }}
      {...props}
    />
  )
}

export const stateColors: Record<ClaimState, string> = {
  OPEN: lightTheme.accent,
  CLOSED: lightTheme.activeInsuranceBackground,
  REOPENED: lightTheme.accentLight,
}

export const LabelWithPopover: React.FC<{ label: string; popover: string }> = ({
  label,
  popover,
}) => (
  <Tooltip.Root>
    <Tooltip.Trigger asChild>
      <Flex align="center" gap="xs">
        <InfoCircle />
        {label}
      </Flex>
    </Tooltip.Trigger>
    <Tooltip.Content>{popover}</Tooltip.Content>
  </Tooltip.Root>
)

interface ClaimListFiltersProps extends React.HTMLAttributes<HTMLDivElement> {
  dateFrom: string | null
  setDateFrom: (date: string | null) => void
  dateTo: string | null
  setDateTo: (date: string | null) => void
  page?: string
  adminFilter: string[] | null
  setAdminFilter: React.Dispatch<React.SetStateAction<string[] | null>>
  sortStale: boolean
  toggleSortStale: () => void
  insuranceTypeFilter: string[]
  setInsuranceTypeFilter: React.Dispatch<React.SetStateAction<string[]>>
  claimTypeFilter: string[]
  setClaimTypeFilter: React.Dispatch<React.SetStateAction<string[]>>
}

export const ClaimListFilters: React.FC<ClaimListFiltersProps> = ({
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  page,
  adminFilter,
  setAdminFilter,
  sortStale,
  toggleSortStale,
  insuranceTypeFilter,
  setInsuranceTypeFilter,
  claimTypeFilter,
  setClaimTypeFilter,
}) => {
  const navigate = useNavigate()
  const { settings, updateSetting } = useMe()
  const [outcomeOpen, setOutcomeOpen] = useState(false)

  const { data: listClaimAssignedAdminsData } =
    useListClaimAssignedAdminsQuery()
  const { data: claimTypesData } = useGetClaimTypesQuery()
  const claimTypeOptions = claimTypesData?.claimTypes ?? []
  const adminOptions =
    listClaimAssignedAdminsData?.listClaimAssignedAdmins ?? []

  const { hasPermission: hasCarPermission } = useHasPermission('listCarClaims')

  const updateFilterHandler = (
    field: keyof UpdateUserSettingInput,
    value: string,
  ) => {
    if (page && page !== '1') {
      navigate(`/claims/list/1`)
    }

    const newSettingValue = settings[field] as string[]

    if (!newSettingValue) {
      updateSetting(field, [value])

      return
    }

    if (newSettingValue.includes(value as string)) {
      updateSetting(
        field,
        newSettingValue?.filter(
          (currentValue: string) => currentValue !== value,
        ),
      )
    } else {
      updateSetting(field, [...newSettingValue, value])
    }
  }

  const updateOutcomeFilterHandler = (value: string | null) => {
    if (!settings.outcomeFilterClaims) {
      updateSetting('outcomeFilterClaims', [value])
    }

    const currentValue = settings.outcomeFilterClaims

    if (!currentValue || typeof currentValue !== 'object') {
      return
    }

    if (!value) {
      updateSetting('outcomeFilterClaims', [])

      return
    }

    if (currentValue.includes(value)) {
      updateSetting(
        'outcomeFilterClaims',
        currentValue.filter((item) => item !== value),
      )

      return
    }

    updateSetting('outcomeFilterClaims', [...currentValue, value])
  }

  const { confirm } = useConfirmDialog()
  const [unassignClaimsFromAdmin] = useUnassignClaimsFromAdminMutation()
  const unassignAdminsInFilter = async () => {
    if (!adminFilter?.length) {
      return
    }

    const admins = adminOptions.filter(({ adminId }) =>
      adminFilter.includes(adminId),
    )
    try {
      await confirm(
        `Are you sure you want to unassign all claims from ${admins
          .map(({ name }) => name)
          .join(', ')}?`,
      )
      await Promise.allSettled(
        admins.map(({ adminId, name }) =>
          toast.promise(unassignClaimsFromAdmin({ variables: { adminId } }), {
            loading: `Unassigning ${name}`,
            success: `${name} unassigned`,
            error: `Error unassigning from ${name}`,
          }),
        ),
      )
      setAdminFilter(null)
    } catch {
      return
    }
  }

  return (
    <Flex direction="column" gap="small" style={{ marginBlock: '1rem' }}>
      <Flex gap="xxl">
        <FilterElement>
          <Label>States</Label>
          {Object.values(ClaimState).map((state) => {
            const stateName = convertEnumOrSentenceToTitle(state)

            return (
              <Flex key={state} direction="row" align="center">
                <form action=""></form>
                <CheckboxInput
                  label={stateName}
                  defaultChecked={settings.claimStatesFilterClaims?.includes(
                    state,
                  )}
                  onChange={() => {
                    updateFilterHandler('claimStatesFilterClaims', state)
                  }}
                />
                <ColorBadge
                  style={{
                    height: '0.7em',
                    width: '0.7em',
                    backgroundColor: stateColors[state],
                  }}
                />
              </Flex>
            )
          })}
        </FilterElement>

        <FilterElement>
          <Label>Markets</Label>
          {Object.values(Market).map((market) => {
            const marketName = convertEnumOrSentenceToTitle(market)

            return (
              <Flex key={market} direction="row" align="center">
                <CheckboxInput
                  label={marketName}
                  defaultChecked={settings.marketFilterClaims?.includes(market)}
                  onChange={() => {
                    updateFilterHandler('marketFilterClaims', market)
                  }}
                />
                <span style={{ marginLeft: '0.5rem' }}>
                  {MarketFlags[market]}
                </span>
              </Flex>
            )
          })}
        </FilterElement>
        <FilterElement>
          <LabelWithPopover
            label="Toggle stale claims"
            popover="Sort based on the claim being the most stale first"
          />
          <Flex align="center" gap="small">
            <CheckboxInput
              label="Sort staleness"
              defaultChecked={sortStale}
              onChange={() => toggleSortStale()}
            />
          </Flex>
        </FilterElement>
        <FilterElement>
          <LabelWithPopover
            label="Date opened"
            popover="Search for a specific range in which the claim was opened"
          />
          <TextDatePicker
            label="Min date"
            value={dateFrom}
            onChange={setDateFrom}
            maxDate={dateTo ? new Date(dateTo) : undefined}
          />
          <TextDatePicker
            label="Max date"
            value={dateTo}
            onChange={setDateTo}
            minDate={dateFrom ? new Date(dateFrom) : undefined}
          />
        </FilterElement>
      </Flex>
      <Flex gap="medium">
        <FilterElement>
          <Label>Outcome</Label>
          <Navigation
            name="Outcome Filter"
            options={{
              resolve: () => {
                setOutcomeOpen((prev) => !prev)
                return convertEnumToTitle(Object.keys(ClaimOutcomes)[0])
              },
            }}
          >
            <OutcomeFilter
              open={outcomeOpen}
              multi
              onSelect={updateOutcomeFilterHandler}
              outcomes={settings.outcomeFilterClaims}
            />
          </Navigation>
        </FilterElement>

        <FilterElement>
          <Label style={{ position: 'relative' }}>
            Assigned to
            {!!adminFilter?.length && (
              <div style={{ position: 'absolute', top: 0, right: 0 }}>
                <Popover contents="Unassign">
                  <BookmarkX
                    style={{ cursor: 'pointer' }}
                    onClick={unassignAdminsInFilter}
                  />
                </Popover>
              </div>
            )}
          </Label>

          <MultiDropdown
            placeholder="Choose admins"
            value={adminOptions
              .filter((admin) => adminFilter?.includes(admin.adminId))
              .map((admin) => admin.name)}
            clearHandler={() => setAdminFilter(null)}
            onChange={(option) => {
              const selectedAdminId = adminOptions.find(
                (admin) => admin.name === option,
              )?.adminId
              if (!selectedAdminId) return
              setAdminFilter((prev) => {
                if (prev?.find((adminId) => adminId === selectedAdminId)) {
                  return prev?.filter((adminId) => adminId !== selectedAdminId)
                }
                return [selectedAdminId, ...(prev ? prev : [])]
              })
            }}
            options={adminOptions.map((admin) => admin.name)}
          />
        </FilterElement>

        {!hasCarPermission && (
          <FilterElement>
            <Label>Insurance type</Label>
            <MultiDropdown
              placeholder="Choose insurance types"
              value={insuranceTypeFilter}
              clearHandler={() => setInsuranceTypeFilter([])}
              onChange={(option) => {
                setInsuranceTypeFilter((prev) =>
                  prev.includes(option)
                    ? prev.filter((value) => value !== option)
                    : [...prev, option],
                )
              }}
              options={Object.values(InsuranceType)}
            />
          </FilterElement>
        )}

        <FilterElement>
          <Label>Claim types</Label>
          <MultiDropdown
            placeholder="Choose claim types"
            value={claimTypeFilter}
            clearHandler={() => setClaimTypeFilter([])}
            onChange={(option) => {
              setClaimTypeFilter((prev) =>
                prev.includes(option)
                  ? prev.filter((value) => value !== option)
                  : [...prev, option],
              )
            }}
            options={claimTypeOptions}
          />
        </FilterElement>
      </Flex>
    </Flex>
  )
}
