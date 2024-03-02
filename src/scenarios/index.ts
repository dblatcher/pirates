import { campaignLevelOne } from './campaign/level-one'
import { bigMesseyBattle } from './big-messy-battle'
import { aiTrial } from './ai-trial'
import { campaignLevelTwo } from './campaign/level-two'
import { Scenario } from './scenarios'
import { sandbox } from './logic-check'
import { tutorialOne } from './tutorial/part-one'
import { tutorialTwo } from './tutorial/part-two'
import { tutorialThree } from './tutorial/part-three'
import { campaignMapTest } from './campaign/map-test'

const scenarios: Record<string, Scenario> = {
    campaignLevelOne, bigMesseyBattle, aiTrial, campaignLevelTwo, sandbox, tutorialOne, tutorialTwo, tutorialThree, campaignMapTest
}
const startingScenarios: Record<string, Scenario> = {
    campaignLevelOne, bigMesseyBattle, tutorialOne, tutorialTwo, tutorialThree
}

export { scenarios, startingScenarios }
export * from './scenarios'