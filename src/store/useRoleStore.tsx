import {create} from 'zustand'

interface RoleStore {
  roleName: string
  roleMessage: string
  setRoleName: (roleName: string) => void
  setRoleMessage: (prompt: string) => void
}

export const useRoleStore = create<RoleStore>((set) => ({
  roleName: "",
  roleMessage: "",
  setRoleName: (roleName) => set(() => ({
    roleName
  })),
  setRoleMessage: (roleMessage) => set(() => ({
    roleMessage
  })),
}))
