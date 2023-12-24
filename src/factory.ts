import type { AI } from "./ai"
import { EscortAutoPilot } from "./ai/escort-ai"

export type AIFactory = {
    escort: { (idOfShipToEscort: number, shipId: number): AI }
}

export const aiFactory: AIFactory = {
    escort: (idOfShipToEscort: number, shipId: number) => new EscortAutoPilot(idOfShipToEscort, shipId)
}