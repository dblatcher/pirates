import type { LogEntry } from "./BuccaneerGame"

interface Props {
    entries: LogEntry[]
    numberToShow?: number
    currentCycleNumber:number
}

export const ShipsLog = ({ entries, numberToShow = 8 , currentCycleNumber}: Props) => {
    const { length } = entries
    const truncatedLog = length <= numberToShow ? [...entries] : entries.slice(length - numberToShow)
    const truncatedLogWithOldMessagesGone = truncatedLog.filter(entry => currentCycleNumber - entry.cycleNumber < 2000)
    const [latestEntry, ...others] = truncatedLogWithOldMessagesGone.reverse()

    return (
        <div className="message-log">
            <ul key={latestEntry.message}>
                <li>{latestEntry.message}</li>
                {others.map((entry, index) =>
                    <li key={index}>{entry.message}</li>
                )}
            </ul>
        </div>
    )
}