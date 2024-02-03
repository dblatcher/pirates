import { CSSProperties, ReactNode } from "react";

interface Props {
    setIsOpen: { (isOpen: boolean): void }
    isOpen: boolean;
    children: ReactNode
}

const modalStyle = (isOpen: boolean): CSSProperties => ({
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

const buttonStyle: CSSProperties = {
    position: 'absolute',
    top: '-1rem',
    right: '-1rem',
}

export const Modal = ({ setIsOpen, isOpen, children }: Props) => {
    return (
        <div  style={modalStyle(isOpen)}>
            <section style={{ position: 'relative' }}>
                <button
                    style={buttonStyle}
                    className="round-button"
                    onClick={() => setIsOpen(false)}>X</button>
                {children}
            </section>
        </div>
    )
}