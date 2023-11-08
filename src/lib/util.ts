
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

/** random integer from 1 to max */
export const randomInt = (max: number): number => {
    return Math.ceil(Math.random() * max)
}