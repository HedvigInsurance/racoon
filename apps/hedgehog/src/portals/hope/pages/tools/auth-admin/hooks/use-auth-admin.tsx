import { ReactNode, createContext, useContext } from 'react'
import { useAuthGroup } from './use-auth-group'

export const AuthAdminContext = createContext<ReturnType<typeof useAuthGroup>>({
  createAuthGroup: () => new Promise(() => null),
  setPermissions: () => new Promise(() => null),
  authGroups: [],
  authPermissions: {},
  allPermissions: {},
  selectedGroup: undefined,
  selectGroup: () => null,
  selectedGroupPermissions: {},
  updatedPermissions: {},
  setUpdatedPermissions: () => null,
  hasPermissionChanges: false,
  addedPermissions: [],
  removedPermissions: [],
})

export const AuthAdminProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AuthAdminContext.Provider value={useAuthGroup()}>
      {children}
    </AuthAdminContext.Provider>
  )
}

export const useAuthAdmin = () => useContext(AuthAdminContext)
