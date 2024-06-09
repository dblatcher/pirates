import { useState } from "react"

export type DebouncerData = {
    /**The timestamp for the last update sent */
    sentTime: number | undefined
    /**Whether an update is currently scheduled */
    isQueued: boolean
    /**The minimum time between updates */
    delay: number
}

export const useDebounce = <T,>(
    update: { (value: T): void },
    delay = 1000
): [{ (value: T): void }, { (): DebouncerData }] => {

    const [timerId, setTimerId] = useState<number | undefined>(undefined)
    const [sentTime, setSentTime] = useState<number>(0)

    const doUpdateFnc = (value: T) => () => {
        update(value)
        setTimerId(undefined)
        setSentTime(Date.now())
    }

    const debouncedUpdate = (value: T) => {
        const timeSinceLastUpdate = Date.now() - sentTime

        if (timeSinceLastUpdate >= delay) {
            return doUpdateFnc(value)()
        }

        if (timerId) {
            clearInterval(timerId)
            setTimerId(undefined)
        }
        const newTimerId = setTimeout(doUpdateFnc(value), delay - timeSinceLastUpdate)
        setTimerId(newTimerId as unknown as number)
    }

    const getData = () => ({
        sentTime,
        isQueued: !!timerId,
        delay,
    })

    return [debouncedUpdate, getData]
}
