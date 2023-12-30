import { createContext, useContext } from "react"
import { Scenario } from '../initial-conditions'

const mangementContext = createContext<{
    mainMenuOpen: boolean,
    scenario?: Scenario
}>({
    mainMenuOpen: false,
    scenario: undefined
})

export const ManagementProvider = mangementContext.Provider

export const useManagement = () => {
    return useContext(mangementContext)
}