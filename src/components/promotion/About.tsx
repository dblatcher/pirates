import { BLUE_SKY_PROFILE } from "../../admin-constants"

export const About = () => {

    return <div style={{
        minWidth: '60vh',
        maxWidth: '90vh',
    }}>
        <p>Buccaneer is a free browser game where you engage in real-time naval combat in the age of sail.</p>
        <ul>
            <li>There are no ads</li>
            <li>It does not track users</li>
        </ul>
        <p>It is a work in progress!</p>
        <p>Comments, suggestions and pirate-themed insults can be sent to me on <a href={BLUE_SKY_PROFILE} target="_blank">{BLUE_SKY_PROFILE}</a></p>
        <h3>Controls</h3>
        <p>Buccaneer is best played with a keyboard. Using the mouse with the on-screen controls is possible, but challenging.</p>
    </div>
}