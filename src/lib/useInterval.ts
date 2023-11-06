import { useEffect, useRef } from "react"

export function useIntervalWithRef(callback: () => void, delay: number | null) {
    const savedCallback = useRef(callback)

    // Set up the interval.
    useEffect(() => {
        // Don't schedule if no delay is specified.
        // Note: 0 is a valid value for delay.
        if (!delay && delay !== 0) {
            return
        }

        const id = setInterval(() => savedCallback.current(), delay)

        return () => clearInterval(id)
    }, [delay])
}

export function useInterval(callback: () => void, delay: number | null) {
    // Set up the interval.
    useEffect(() => {
        // Don't schedule if no delay is specified.
        // Note: 0 is a valid value for delay.
        if (!delay && delay !== 0) {
            return
        }

        const id = setInterval(() => callback(), delay)
        return () => {
            clearInterval(id)
        }
    }, [delay, callback])
}