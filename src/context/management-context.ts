import { createContext, useContext } from "react"
import { Scenario, ScenarioOutcome } from '../initial-conditions'

const mangementContext = createContext<{
    mainMenuOpen: boolean,
    soundIsEnabled: boolean,
    gameIsPaused: boolean,
    toggleSound: { (): Promise<void> }
    scenario?: Scenario,
    reportOutcome: { (outcome: ScenarioOutcome): void }
    cyclePeriod: number,
}>({
    mainMenuOpen: false,
    soundIsEnabled: false,
    gameIsPaused: false,
    toggleSound: () => Promise.resolve(),
    scenario: undefined,
    reportOutcome: () => { },
    cyclePeriod: 10
})

export const ManagementProvider = mangementContext.Provider

export const useManagement = () => {
    return useContext(mangementContext)
}