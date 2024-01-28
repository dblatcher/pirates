import { FacialExpression, FunnyFace } from "@dblatcher/funny-face";
import { CSSProperties } from "react";
import { Person } from "../initial-conditions";

interface Props {
    person: Person,
    talking: boolean,
    expression?: FacialExpression,
}


const figureStyle: CSSProperties = {
    margin: 0,
    display: "flex",
    flexDirection: 'column',
    alignItems:'center',
}
const personNameStye: CSSProperties = {
    paddingTop: '.75rem',
    textAlign: 'center',
    display: 'block',
    fontSize: 'small',
    lineHeight: 1.05,
    maxWidth:'8rem',
}

export const PersonFace = ({ person, talking, expression }: Props) => {

    return (
        <figure style={figureStyle}>
            <FunnyFace
                size={person.size ?? 100}
                x={0} y={0}
                expression={expression}
                talking={talking}
                profile={person.profile}
                accessories={person.accessories}
            />
            {person.name &&
                <figcaption style={personNameStye}>{person.name}</figcaption>
            }
        </figure>
    )
}