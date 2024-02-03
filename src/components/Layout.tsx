import { CSSProperties, ReactNode } from "react";

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
}

export const Layout = ({ children, topMenu, bottomNav }: { children: ReactNode, topMenu?: ReactNode, bottomNav?: ReactNode }) => {

    return (
        <div style={containerStyle}>
            <nav style={navStyle}>{topMenu}</nav>
            <section style={centerStyle}>
                {children}
            </section>
            <nav style={navStyle}>{bottomNav}</nav>
        </div>
    )

}