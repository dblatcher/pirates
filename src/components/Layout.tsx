import { CSSProperties, ReactNode } from "react";
import { cornerOverlay } from "../lib/style-helpers";

const containerStyle: CSSProperties = {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
}

const centerStyle: CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
}

const navStyle: CSSProperties = {
    minHeight: '2rem',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%'
}

export const Layout = ({ children, topMenu }: { children: ReactNode, topMenu?: ReactNode }) => {

    return (
        <div style={containerStyle}>
            <section style={centerStyle}>
                {children}
            </section>
            <nav style={navStyle}>{topMenu}</nav>
        </div>
    )

}