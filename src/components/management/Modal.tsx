import { ReactNode } from "react";

interface Props {
    setIsOpen: { (isOpen: boolean): void }
    isOpen: boolean;
    children: ReactNode
}


export const Modal = ({ setIsOpen, isOpen, children }: Props) => {


    return (
        <div className="modal-frame" style={{ display: isOpen ? 'unset' : 'none' }}>
            <button onClick={() => setIsOpen(false)}>close</button>
            <aside>
                {children}
            </aside>
        </div>
    )
}