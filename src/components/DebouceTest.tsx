import { useState } from "react"
import { useDebounce } from "../hooks/useDebounce"



const NumberControl = ({ update, parentValue }: { update: { (value: number): void }, parentValue: number }) => {
    const [debouncedUpdate, getData] = useDebounce(update, 3000)
    const { isQueued, sentTime } = getData()

    return (
        <div>
            <label>Number debounce child: </label>
            <ul>
                <li>
                    <b>parent:</b>
                    <span>{parentValue}</span>
                </li>
                <li>
                    <b>isQueued:</b>
                    <span>{isQueued.toString()}</span>
                </li>
                <li>
                    <b>sentTime:</b>
                    <span>{sentTime}</span>
                </li>
            </ul>
            <button onClick={() => { debouncedUpdate(20) }}>update 20</button>
            <button onClick={() => { debouncedUpdate(30) }}>update 30</button>
            <button onClick={() => { debouncedUpdate(40) }}>update 40</button>
        </div>
    )
}

const StringControl = ({ update, parentValue }: { update: { (value: string): void }, parentValue: string }) => {
    const [debouncedSetWheel, getData] = useDebounce(update, 3000)
    const { isQueued, sentTime } = getData()

    return (
        <div>
            <label>Number debounce child: </label>
            <ul>
                <li>
                    <b>parent:</b>
                    <span>{parentValue}</span>
                </li>
                <li>
                    <b>isQueued:</b>
                    <span>{isQueued.toString()}</span>
                </li>
                <li>
                    <b>sentTime:</b>
                    <span>{sentTime}</span>
                </li>
            </ul>
            <button onClick={() => { debouncedSetWheel('fish') }}>update fish</button>
            <button onClick={() => { debouncedSetWheel('hotel') }}>update hotel</button>
            <button onClick={() => { debouncedSetWheel('quite') }}>update quite</button>
        </div>
    )
}

export const DebounceTest = () => {

    const [numberState, setNumberState] = useState(42)
    const [stringState, setStringState] = useState("abc")

    return (
        <div>
            <div>
                <span>numberState: {numberState}</span>
            </div>
            <div>
                <span>stringState: {stringState}</span>
            </div>
            <ul>
                <li>
                    <NumberControl
                        parentValue={numberState}
                        update={setNumberState} />
                </li>
                <li>
                    <StringControl
                        parentValue={stringState}
                        update={setStringState} />
                </li>
            </ul>
        </div>
    )

}