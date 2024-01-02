import { createContext, useContext } from "react"
import { Scenario, ScenarioOutcome } from '../initial-conditions'

const mangementContext = createContext<{
    mainMenuOpen: boolean,
    soundIsEnabled: boolean,
    gameIsPaused: boolean,
    toggleSound: { (): Promise<void> }
    scenario?: Scenario,
    reportOutcome: { (outcome: ScenarioOutcome): void }
}>({
    mainMenuOpen: false,
    soundIsEnabled: false,
    gameIsPaused: false,
    toggleSound: () => Promise.resolve(),
    scenario: undefined,
    reportOutcome: () => { }
})

export const ManagementProvider = mangementContext.Provider

export const useManagement = () => {
    return useContext(mangementContext)
}