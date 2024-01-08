import type { AI } from "./ai"
import { FollowerAutoPilot } from "./ai/follower-ai"

export type AIFactory = {
    follow: { (idOfShipToFollow: number, shipId: number): AI }
}

export const aiFactory: AIFactory = {
    follow: (idOfShipToFollow: number, shipId: number) => new FollowerAutoPilot(idOfShipToFollow, shipId)
}