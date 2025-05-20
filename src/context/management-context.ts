import { createContext, Dispatch, SetStateAction, useContext } from "react"
import { Scenario, ScenarioOutcome } from '../scenarios'
import { ControlMode } from "../lib/types"

const mangementContext = createContext<{
    mainMenuOpen: boolean,
    soundIsEnabled: boolean,
    gameIsPaused: boolean,
    toggleSound: { (): Promise<void> }
    scenario?: Scenario,
    reportOutcome: { (outcome: ScenarioOutcome): void }
    cyclePeriod: number,
    controlMode: ControlMode,
    setControlMode: Dispatch<SetStateAction<ControlMode>>
}>({
    mainMenuOpen: false,
    soundIsEnabled: false,
    gameIsPaused: false,
    toggleSound: () => Promise.resolve(),
    scenario: undefined,
    reportOutcome: () => { },
    cyclePeriod: 10,
    controlMode: 'desktop',
    setControlMode: () => { }
})

export const ManagementProvider = mangementContext.Provider

export const useManagement = () => {
    return useContext(mangementContext)
}