interface Props {
    entries: string[]
    numberToShow?: number
}

export const ShipsLog = ({ entries, numberToShow = 8 }: Props) => {
    const { length } = entries
    const tail = length <= numberToShow ? [...entries] : entries.slice(length - numberToShow)

    return (
        <div className="panel-frame">
            <ul>
                {tail.map((entry, index) =>
                    <li key={index}>{entry}</li>
                )}
            </ul>
        </div>
    )
}