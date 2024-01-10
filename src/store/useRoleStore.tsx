import {create} from 'zustand'
import {Role} from "@/pages/Home.tsx";

interface RoleStore {
  roleName: string
  roleMessage: string
  currentRole: Role | null
  setRoleName: (roleName: string) => void
  setRoleMessage: (prompt: string) => void
  setCurrentRole: (role: RoleStore["currentRole"]) => void
}

export const useRoleStore = create<RoleStore>((set) => ({
  roleName: "",
  roleMessage: "",
  currentRole: null,
  setRoleName: (roleName) => set(() => ({
    roleName
  })),
  setRoleMessage: (roleMessage) => set(() => ({
    roleMessage
  })),
  setCurrentRole: (role) => set(() => ({
    currentRole: role
  })),
}))
