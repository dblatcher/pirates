
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