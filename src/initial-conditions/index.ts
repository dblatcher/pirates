import { demoOne } from './demo-one'
import { bigMesseyBattle } from './big-messy-battle'
import { aiTrial } from './ai-trial'
import { demoTwo } from './demo-two'
import { Scenario } from './scenarios'

const scenarios: Record<string, Scenario> = {
    demoOne, bigMesseyBattle, aiTrial, demoTwo
}
const startingScenarios: Record<string, Scenario> = {
    demoOne, bigMesseyBattle, aiTrial
}

export { scenarios, startingScenarios }
export * from './scenarios'