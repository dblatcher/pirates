import { useManagement } from "../context/management-context";


export const SoundToggle = () => {
    const { soundIsEnabled, toggleSound } = useManagement()
    return <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
    }}>
        <button onClick={toggleSound}>
            <div className="sound-icon">
                {soundIsEnabled ? <i>🔊</i> : <i>🔇</i>}
            </div>
        </button>
    </div>
} 