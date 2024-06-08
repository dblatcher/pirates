import { createContext, useContext, useRef, MutableRefObject } from "react"
import { Directive } from "../game-state"

export type KeyMap = Record<string, boolean>

export class DirectiveEvent extends MessageEvent<Directive> {
    data: Directive
    constructor(data: Directive) {
        super('directive', { data })
        this.data = data
    }
}

type Handler<T extends Event> = { (event: T): void }

export class ControlCenter extends EventTarget {

    sendDirective(data: Directive) {
        const event = new DirectiveEvent(data)
        this.dispatchEvent(event)
    }
    onDirective(handler: Handler<DirectiveEvent>) {
        this.addEventListener('directive', handler as EventListener)
    }
    offDirective(handler: Handler<DirectiveEvent>) {
        this.removeEventListener('directive', handler as EventListener)
    }
}
useRef
const ControlContext = createContext<{
    center: ControlCenter
    keyMapRef?: MutableRefObject<KeyMap>
}>({
    center: new ControlCenter(),
    keyMapRef: undefined,
})

export const useControls = () => useContext(ControlContext)

export const ControlsProvider = ControlContext.Provider