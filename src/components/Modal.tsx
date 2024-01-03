import { ReactNode } from "react";

interface Props {
    setIsOpen: { (isOpen: boolean): void }
    isOpen: boolean;
    children: ReactNode
}


export const Modal = ({ setIsOpen, isOpen, children }: Props) => {
    return (
        <div className="modal-frame" style={{ display: isOpen ? undefined : 'none' }}>
            <section>
                <button onClick={() => setIsOpen(false)}>X</button>
                {children}
            </section>
        </div>
    )
}