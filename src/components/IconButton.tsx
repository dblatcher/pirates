interface Props {
    onClick: { (): void }
    icon: string
}

export const IconButton = ({ onClick, icon }: Props) => (
    <button onClick={onClick}>
        <div className="menu-icon">
            <i>{icon}</i>
        </div>
    </button>
)
