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

    return (
        <div className="message-log">
            <ul key={truncatedLogWithOldMessagesGone.map(_=>_.message).join()}>  
                {truncatedLogWithOldMessagesGone.reverse().map((entry, index) =>
                    <li key={index}>{entry.message}</li>
                )}
            </ul>
        </div>
    )
}