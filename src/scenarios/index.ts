import { demoOne } from './demo-one'
import { bigMesseyBattle } from './big-messy-battle'
import { aiTrial } from './ai-trial'
import { demoTwo } from './demo-two'
import { Scenario } from './scenarios'
import { sandbox } from './logic-check'
import { tutorialOne } from './tutorial/part-one'

const scenarios: Record<string, Scenario> = {
    demoOne, bigMesseyBattle, aiTrial, demoTwo, sandbox, tutorialOne,
}
const startingScenarios: Record<string, Scenario> = {
    demoOne, bigMesseyBattle, aiTrial, sandbox, tutorialOne
}

export { scenarios, startingScenarios }
export * from './scenarios'