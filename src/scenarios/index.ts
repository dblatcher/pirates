import { demoOne } from './demo-one'
import { bigMesseyBattle } from './big-messy-battle'
import { aiTrial } from './ai-trial'
import { demoTwo } from './demo-two'
import { Scenario } from './scenarios'
import { sandbox } from './logic-check'
import { tutorialOne } from './tutorial/part-one'
import { tutorialTwo } from './tutorial/part-two'
import { tutorialThree } from './tutorial/part-three'

const scenarios: Record<string, Scenario> = {
    demoOne, bigMesseyBattle, aiTrial, demoTwo, sandbox, tutorialOne, tutorialTwo, tutorialThree
}
const startingScenarios: Record<string, Scenario> = {
    demoOne, bigMesseyBattle, aiTrial, sandbox, tutorialOne, tutorialTwo, tutorialThree
}

export { scenarios, startingScenarios }
export * from './scenarios'