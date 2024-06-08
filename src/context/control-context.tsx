import { createContext, useContext } from "react"
import { Directive } from "../game-state"


export class DirectiveEvent extends MessageEvent<Directive> {
    data: Directive
    constructor(directive: Directive) {
        super('directive', { data: directive })
        this.data = directive
    }
}

type Handler<T extends Event> = { (event: T): void }

export class ControlCenter extends EventTarget {

    sendDirective(d: Directive) {
        const event = new DirectiveEvent(d)
        this.dispatchEvent(event)
    }

    onDirective(handler: Handler<DirectiveEvent>) {
        this.addEventListener('directive', handler as EventListener)
    }
    offDirective(handler: Handler<DirectiveEvent>) {
        this.removeEventListener('directive', handler as EventListener)
    }
}

const ControlContext = createContext({
    center: new ControlCenter()
})

export const useControls = () => useContext(ControlContext)

export const ControlsProvider = ControlContext.Provider