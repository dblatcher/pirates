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


export const Layout = ({ children }: { children: ReactNode}) => {
    return (
        <div style={containerStyle}>
            <section style={centerStyle}>
                {children}
            </section>
        </div>
    )
}