import { useEffect } from "react"


export function useSchedule(callback: () => void, delay: number | null) {

    let lastExecutionTime = Date.now()
    let timeoutId: number | undefined = undefined

    const determineInterval = (newTime: number): number => {
        const timeSinceLast = newTime - lastExecutionTime
        const timeToWait = Math.max(delay ?? 0 - timeSinceLast, 1)
        // console.log('timeToWait', { timeSinceLast, timeToWait, delay })
        return timeToWait
    }

    // Set up the interval.
    useEffect(() => {

        const schedule = async (interval: number) => {
            const newTime = Date.now()
            timeoutId = window.setTimeout(() => {
                callback()

                if (typeof delay === 'number') {
                    const timeout = determineInterval(newTime)
                    schedule(timeout)
                    lastExecutionTime = newTime
                }

            }, interval)
        }

        if (typeof delay === 'number') {
            schedule(delay)
        }

        return () => {
            if (typeof timeoutId === 'number') {
                clearInterval(timeoutId)
            }
        }

    }, [delay, callback])
}