import { createContext, useContext } from "react"
import { Scenario } from '../initial-conditions'

const mangementContext = createContext<{
    mainMenuOpen: boolean,
    soundIsEnabled: boolean,
    toggleSound: { (): Promise<void> }
    scenario?: Scenario,
}>({
    mainMenuOpen: false,
    soundIsEnabled: false,
    toggleSound: () => Promise.resolve(),
    scenario: undefined,
})

export const ManagementProvider = mangementContext.Provider

export const useManagement = () => {
    return useContext(mangementContext)
}