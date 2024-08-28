import * as React from 'react'
import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { Spinner, StandaloneMessage } from '@hedvig-ui'
import TagManager from 'react-gtm-module'
import { useClaimDetailsLazyQuery } from 'types/generated/graphql'
import { ClaimState } from '@hope/features/config/constants'
import { toast } from 'react-hot-toast'
import { HopeAuthGuard, hopeAuthPermissions } from 'auth'
import { usePathname } from 'next/navigation'

const ToolsPage = lazy(() => import('portals/hope/pages/tools/ToolsPage'))
const DashboardPage = lazy(() => import('./DashboardPage'))
const SearchPage = lazy(() => import('portals/hope/pages/search/SearchPage'))
const TasksPage = lazy(() => import('portals/hope/pages/tasks/TasksPage'))
const ClaimsListPage = lazy(
  () => import('portals/hope/pages/claims/list/ClaimsListPage'),
)
const ClaimPage = lazy(() => import('portals/hope/pages/claims/ClaimPage'))
const MemberPage = lazy(() => import('portals/hope/pages/members/MemberPage'))
const TasksToolPage = lazy(
  () => import('portals/hope/pages/tools/TasksToolPage'),
)
const ProfilePage = lazy(() => import('./settings/ProfilePage'))

const PaymentOrdersPage = lazy(
  () => import('portals/hope/pages/tools/payment-orders/PaymentOrdersPage'),
)
const SingleOrderPage = lazy(
  () => import('portals/hope/pages/tools/payment-orders/SingleOrderPage'),
)
const ValuationTablesPage = lazy(
  () => import('portals/hope/pages/tools/ValuationTablesPage'),
)
const PerilsEditorPage = lazy(
  () => import('portals/hope/pages/tools/PerilsEditorPage'),
)
const CampaignCodesPage = lazy(
  () => import('portals/hope/pages/tools/CampaignCodesPage'),
)
const ClaimTypesPage = lazy(
  () => import('portals/hope/pages/tools/ClaimTypesPage'),
)
const TemplateMessagesPage = lazy(
  () => import('portals/hope/pages/tools/TemplateMessagesPage'),
)
const AuthAdminPage = lazy(
  () => import('portals/hope/pages/tools/auth-admin/AuthAdminPage'),
)
const GsrCaseOfficersPage = lazy(
  () => import('portals/hope/pages/tools/GsrCaseOfficersPage'),
)
const CreateLeadPage = lazy(() => import('./tools/CreateLeadPage'))
const ItemModelsPage = lazy(
  () => import('portals/hope/pages/tools/ItemModelsPage'),
)
const ClaimStartVariantsPage = lazy(
  () => import('portals/hope/pages/tools/ClaimStartVariants'),
)
const EntrypointsPage = lazy(
  () => import('./tools/entrypoints/EntrypointsPage'),
)
const BatchUploadPaymentOrderPage = lazy(
  () => import('./tools/BatchUploadPaymentOrdersPage'),
)
const ManyPetsPage = lazy(() => import('./tools/manyPets/ManyPetsPage'))

const ManualSasPayoutPage = lazy(() => import('./tools/ManualSasPayoutPage'))

const ShopSessionPage = lazy(() => import('./tools/ShopSessionPage'))

const UserPanelPage = lazy(() => import('./tools/UserPanelPage'))

const ImpersonateMemberPage = lazy(
  () => import('../features/tools/impersonate-member/ImpersonateMemberPage'),
)
const UnsignMemberPage = lazy(
  () => import('portals/hope/pages/tools/UnsignMemberPage'),
)

// Replace member IDs or UUIDs with {id} to simplify page tracking
const getCleanPath = (pathname: string) =>
  pathname
    .split('/')
    .map((subpath) => {
      if (subpath === '') {
        return subpath
      }

      const isNumber = !isNaN(Number(subpath))

      if (isNumber) {
        return '{id}'
      }

      return subpath.length < 16 ? subpath : '{id}'
    })
    .join('/')

export const HopePageRoutes: React.FC = () => {
  const [, setPrevPath] = useState<string | null>(null)
  const [, setPrevSearch] = useState<string | null>(null)

  const pathname = usePathname()
  const location = useLocation()
  const navigate = useNavigate()

  const [getClaim] = useClaimDetailsLazyQuery({
    fetchPolicy: 'cache-only',
  })

  const handleLeaveClaim = useCallback(
    (claimId: string) => {
      getClaim({ variables: { claimId } }).then((res) => {
        const claim = res.data?.claim
        if (!claim) return
        if (
          claim.state !== ClaimState.Closed &&
          claim.subclaims.some(({ reserve }) => !reserve.amount)
        ) {
          toast('The claim you left has no reserves', {
            icon: '⚠️',
            iconTheme: {
              primary: '#444333',
              secondary: '#333444',
            },
          })
        }
      })
    },
    [getClaim],
  )

  useEffect(() => {
    setPrevPath((currentPrevPath) => {
      const pathname = location.pathname

      if (currentPrevPath === null) {
        return pathname
      }

      const pageClaim =
        currentPrevPath.includes('claims/') &&
        !currentPrevPath.includes('/list')
          ? currentPrevPath
              .substring(currentPrevPath.indexOf('claims/'))
              ?.split('/')[1]
          : undefined

      if (pageClaim) handleLeaveClaim(pageClaim)

      if (currentPrevPath !== pathname) {
        TagManager.dataLayer({
          dataLayer: {
            event: 'virtual_page_view',
            cleanPath: getCleanPath(pathname),
            cleanPrevPath: getCleanPath(currentPrevPath),
          },
        })
        return pathname
      }

      return currentPrevPath
    })
  }, [location.pathname, handleLeaveClaim])

  useEffect(() => {
    setPrevSearch((currentPrevSearch) => {
      const search = location.search

      if (currentPrevSearch === null) {
        return location.search
      }

      const claimIds = []

      let searchString = currentPrevSearch
      while (searchString.includes('claimId=')) {
        const indexOfFirst = searchString.indexOf('claimId=')
        const claimId = searchString
          .substring(indexOfFirst)
          ?.split('=')[1]
          ?.split('&')[0]
        claimIds.push(claimId)
        searchString = searchString.substring(
          indexOfFirst + 'claimId='.length + claimId.length,
        )
      }

      const activeId = currentPrevSearch
        .substring(currentPrevSearch.indexOf('active='))
        ?.split('=')[1]
        ?.split('&')[0]
      const newActiveId = search
        .substring(search.indexOf('active='))
        ?.split('=')[1]
        ?.split('&')[0]

      // We're still on the same claim
      if (activeId === newActiveId) {
        return search
      }
      if (activeId && claimIds.includes(activeId)) {
        handleLeaveClaim(activeId)
      }

      return search
    })
  }, [location.search, handleLeaveClaim])

  // Synchronize React Router's state with Next.js route changes
  useEffect(() => {
    if (location.pathname !== pathname) {
      navigate(pathname, { replace: true })
    }
  }, [location.pathname, pathname, navigate])

  return (
    <Suspense fallback={<Spinner />}>
      <Routes key={pathname}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/dashborad" element={<DashboardPage />} />
        <Route path="/questions" element={<TasksPage />} />
        <Route path="/inbox" element={<TasksPage />} />
        <Route
          path="/search/:category"
          element={
            <HopeAuthGuard
              requires={hopeAuthPermissions.members['member-data:search']}
            >
              <SearchPage />
            </HopeAuthGuard>
          }
        />
        <Route
          path="/claims/list/:page?"
          element={
            <HopeAuthGuard requires={hopeAuthPermissions.claims['claims:read']}>
              <ClaimsListPage />
            </HopeAuthGuard>
          }
        />
        <Route
          path="/claims/:claimId"
          element={
            <HopeAuthGuard requires={hopeAuthPermissions.claims['claims:read']}>
              <ClaimPage />
            </HopeAuthGuard>
          }
        />
        <Route
          path="/claims/:claimId/members/:memberId"
          element={<Navigate to="/claims/:claimId" />}
        />
        <Route path="/members/:memberId/:tab?" element={<MemberPage />} />

        <Route path="/tools" element={<ToolsPage />} />
        <Route
          path="/tools/payment-orders"
          element={
            <HopeAuthGuard requires={hopeAuthPermissions.claims['claims:read']}>
              <PaymentOrdersPage />
            </HopeAuthGuard>
          }
        />
        <Route
          path="/tools/payment-orders/:orderId"
          element={
            <HopeAuthGuard requires={hopeAuthPermissions.claims['claims:read']}>
              <SingleOrderPage />
            </HopeAuthGuard>
          }
        />
        <Route path="/tools/claim-types" element={<ClaimTypesPage />} />
        <Route path="/tools/item-models" element={<ItemModelsPage />} />
        <Route
          path="/tools/valuation-tables"
          element={<ValuationTablesPage />}
        />
        <Route path="/tools/perils-editor" element={<PerilsEditorPage />} />
        <Route path="/tools/campaign-codes" element={<CampaignCodesPage />} />
        <Route path="/tools/unsign-member" element={<UnsignMemberPage />} />
        <Route path="/tools/tasks" element={<TasksToolPage />} />
        <Route
          path="/tools/template-messages"
          element={<TemplateMessagesPage />}
        />
        <Route
          path="/tools/auth-admin"
          element={
            <HopeAuthGuard requires={hopeAuthPermissions.auth['auth-manage']}>
              <AuthAdminPage />
            </HopeAuthGuard>
          }
        />
        <Route
          path="/tools/gsr-case-officers"
          element={<GsrCaseOfficersPage />}
        />
        <Route
          path="/tools/impersonate-member"
          element={<ImpersonateMemberPage />}
        />
        <Route path="/tools/create-lead" element={<CreateLeadPage />} />
        <Route
          path="/tools/claim-start-variants"
          element={<ClaimStartVariantsPage />}
        />
        <Route path="/tools/entrypoints" element={<EntrypointsPage />} />
        <Route
          path="/tools/batch-upload-payment-orders"
          element={
            <HopeAuthGuard requires={hopeAuthPermissions.claims['claims:read']}>
              <BatchUploadPaymentOrderPage />
            </HopeAuthGuard>
          }
        />
        <Route
          path="/tools/create-manypets-offer-links"
          element={<ManyPetsPage />}
        />
        <Route
          path="/tools/manual-sas-payout"
          element={
            <HopeAuthGuard
              requires={
                hopeAuthPermissions['member-service'][
                  'bonus-partner:manual-payout'
                ]
              }
            >
              <ManualSasPayoutPage />
            </HopeAuthGuard>
          }
        />
        <Route path="/tools/shop-session" element={<ShopSessionPage />} />
        <Route path="/tools/user-panel" element={<UserPanelPage />} />

        <Route
          element={
            <StandaloneMessage paddingTop="25vh">
              Page not found
            </StandaloneMessage>
          }
        />
      </Routes>
    </Suspense>
  )
}
