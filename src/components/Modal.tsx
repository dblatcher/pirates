import { CSSProperties, ReactNode } from "react";

interface Props {
    setIsOpen: { (isOpen: boolean): void }
    isOpen: boolean;
    title: string;
    children: ReactNode
}

const modalFrameStyle = (isOpen: boolean): CSSProperties => ({
    display: isOpen ? 'flex' : 'none',
    position: 'fixed',
    inset: 0,
    boxSizing: 'border-box',
    margin: 0,
    padding: '2rem',
    backgroundColor: 'rgba(0, 0, 0, .5)',
    justifyContent: 'center',
    alignItems: 'center',
})

const closeOverlayStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    zIndex: -1,
    background: 'none',
    border:'none',
    outline:'none',
}


const headerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
}

export const Modal = ({ setIsOpen, isOpen, children, title }: Props) => {
    return (
        <div style={modalFrameStyle(isOpen)}>
            <button style={closeOverlayStyle} onClick={() => setIsOpen(false)}></button>
            <section className="paper">
                <header style={headerStyle}>
                    <h2>{title}</h2>
                    <button
                        className="scrawl-button"
                        onClick={() => setIsOpen(false)}>X</button>
                </header>
                {children}
            </section>
        </div>
    )
}