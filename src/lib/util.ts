
export const splitArray = <T,>(list: T[], predicate: { (item: T): boolean }): [T[], T[]] => {
    const passes: T[] = []
    const fails: T[] = []
    list.forEach(item => {
        if (predicate(item)) {
            passes.push(item)
        } else {
            fails.push(item)
        }
    })
    return [passes, fails]
}

export function clamp(value: number, max = 1, min = 0) {
    return Math.max(Math.min(value, max), min)
}

export const isEven = (value: number) => value % 2 === 0

export const average = (list: number[]): number =>
    list.reduce((previous, current) => previous + current, 0) / list.length

export const sum = (list: number[]): number => list.reduce((previous, current) => previous + current, 0) 

/** random integer from 1 to max */
export const randomInt = (max: number): number => {
    return Math.ceil(Math.random() * max)
}

/** convert a timestamp a number going up and down within a range around zero */
export const timePhase = (t: number, phase: number, step = 1): number =>
    Math.abs(((t * (step)) % (phase * 2)) - phase) - (phase * .5)
