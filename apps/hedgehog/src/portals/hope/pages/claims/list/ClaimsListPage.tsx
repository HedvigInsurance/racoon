import styled from '@emotion/styled'
import {
  Button,
  FadeIn,
  Flex,
  Input,
  LoadingMessage,
  MainHeadline,
  useLocalStorage,
  useQueryParams,
} from '@hedvig-ui'
import { ClaimsTemplates } from '@hope/features/claims/claim-templates/ClaimsTemplatesList'
import { ClaimTemplateFilters } from '@hope/features/claims/claim-templates/components/ClaimTemplateFilters'
import { useTemplateClaims } from '@hope/features/claims/claim-templates/hooks/use-template-claims'
import {
  ClaimListFilters,
  LabelWithPopover,
} from '@hope/features/claims/claims-list/filters/ClaimListFilters'
import { LargeClaimsList } from '@hope/features/claims/claims-list/LargeClaimsList'
import { useCallback, useEffect, useState } from 'react'
import * as React from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { ClaimComplexity } from 'types/generated/graphql'
import {
  ClaimState,
  InsuranceType,
  TypeOfContractByInsuranceType,
} from '@hope/features/config/constants'
import { useHasPermission } from '@hope/common/hooks/use-has-permission'
import { useListClaims } from '@hope/features/claims/claims-list/graphql/use-list-claims'
import { useMe } from '@hope/features/user/hooks/use-me'

const ListPage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 0;
  padding: 2rem;
`

export interface ClaimsFiltersType {
  filterClaimStates: ClaimState[] | null
  filterCreatedBeforeOrOnDate: string | null
  filterComplexities: ClaimComplexity[] | null
  filterMarkets: string[] | null
  filterTypesOfContract: string[] | null
  filterClaimOutcomes: string[] | null
  filterClaimTypes: string[]
}

const ClaimsListPage: React.FC = () => {
  const [sortStale, setSortStale] = useLocalStorage<boolean>(
    'hvg:claim-list-sort-by',
    false,
  )
  const { page = '1' } = useParams<{ page?: string }>()
  const location = useLocation()
  const filterQuery = useQueryParams().get('template')

  const {
    templateActive,
    selectedTemplate,
    localFilter,
    templateFilters,
    selectTemplate,
    createTemplate,
    editTemplate,
  } = useTemplateClaims(filterQuery)

  const [dateFrom, setDateFrom] = useLocalStorage<string | null>(
    'hvg:claims-date-from',
    null,
  )
  const [dateTo, setDateTo] = useLocalStorage<string | null>(
    'hvg:claims-date-to',
    null,
  )
  const [adminFilter, setAdminFilter] = useLocalStorage<string[] | null>(
    'hvg:claims-admin-filter',
    null,
  )
  const [insuranceTypeFilter, setInsuranceTypeFilter] = useLocalStorage<
    string[]
  >('hvg:claims-insurance-type-filter', [])

  const [claimTypeFilter, setClaimTypeFilter] = useLocalStorage<string[]>(
    'hvg:claims-claim-type-filter',
    [],
  )

  useEffect(() => {
    const from = (location?.state as { from?: string })?.from

    if (from === 'menu') {
      setDateTo(new Date().toISOString().split('T')[0])
    }

    window.history.replaceState({}, document.title)
    // I don't dare touch this atm, feel free to fix
    // eslint-disable-next-line
  }, [location?.state])

  const selectedPage = parseInt(page, 10)

  const { hasPermission: hasCarPermission, loading: loadingPermission } =
    useHasPermission('listCarClaims')

  const [
    { claims, page: currentPage, totalPages, totalClaims },
    listClaims,
    { loading: loadingClaims },
  ] = useListClaims()

  const { settings } = useMe()

  const [searchString, setSearchString] = useState('')

  const searchClaims = useCallback(
    (searchString?: string) => {
      if (loadingPermission) {
        return
      }
      const settingsFilters = {
        filterOpenedBeforeOrOnDate: dateTo,
        filterOpenedAfterOrOnDate: dateFrom,
        filterClaimStates: settings.claimStatesFilterClaims,
        filterComplexities: settings.claimComplexityFilterClaims,
        filterMarkets: settings.marketFilterClaims,
        filterTypesOfContract: hasCarPermission
          ? TypeOfContractByInsuranceType.SWEDISH_CAR
          : insuranceTypeFilter.flatMap(
              (insuranceType) =>
                TypeOfContractByInsuranceType[insuranceType as InsuranceType],
            ),
        filterClaimTypes: claimTypeFilter,
        filterClaimOutcomes: settings.outcomeFilterClaims,
        searchString,
      }

      listClaims({
        page: isNaN(selectedPage) ? 0 : selectedPage - 1,
        ...(sortStale
          ? { sortBy: 'STALENESS', sortDirection: 'ASC' }
          : { sortBy: 'DATE', sortDirection: 'DESC' }),
        adminIds: adminFilter,
        ...(!templateActive ? settingsFilters : localFilter ? localFilter : {}),
      })
    },
    [
      selectedPage,
      dateTo,
      dateFrom,
      settings,
      localFilter,
      loadingPermission,
      hasCarPermission,
      listClaims,
      templateActive,
      adminFilter,
      insuranceTypeFilter,
      claimTypeFilter,
      sortStale,
    ],
  )

  useEffect(() => {
    searchClaims()
  }, [searchClaims])

  return (
    <ListPage>
      <FadeIn>
        <MainHeadline>Claims</MainHeadline>
      </FadeIn>

      <ClaimsTemplates
        activeId={selectedTemplate}
        templates={templateFilters}
        onSelect={selectTemplate}
        onCreate={createTemplate}
      />

      {templateActive && selectedTemplate ? (
        <ClaimTemplateFilters
          templateId={selectedTemplate}
          template={localFilter}
          editTemplate={editTemplate}
        />
      ) : (
        <ClaimListFilters
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          dateTo={dateTo}
          setDateTo={setDateTo}
          page={page}
          adminFilter={adminFilter}
          setAdminFilter={setAdminFilter}
          insuranceTypeFilter={insuranceTypeFilter}
          setInsuranceTypeFilter={setInsuranceTypeFilter}
          claimTypeFilter={claimTypeFilter}
          setClaimTypeFilter={setClaimTypeFilter}
          sortStale={sortStale}
          toggleSortStale={() => setSortStale((current) => !current)}
        />
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          searchClaims(searchString)
        }}
      >
        <Flex align="end" gap="small">
          <div>
            <LabelWithPopover
              label="Search"
              popover="Search for id, number or member id"
            />
            <Input
              value={searchString}
              onChange={({ currentTarget }) =>
                setSearchString(currentTarget.value)
              }
              placeholder="Id or number"
              style={{ width: '30rem' }}
            />
          </div>
          <Button variant="secondary">Search</Button>
        </Flex>
      </form>

      {loadingClaims ? (
        <LoadingMessage paddingTop="25vh" />
      ) : (
        <LargeClaimsList
          claims={claims}
          currentPage={currentPage}
          totalPages={totalPages}
          totalClaims={totalClaims}
        />
      )}
    </ListPage>
  )
}

export default ClaimsListPage
