import { CSSProperties, InputHTMLAttributes } from "react"

type Props = Pick<
    InputHTMLAttributes<HTMLInputElement>, 
    'max' | 'min' | 'step' | 'alt' | 'name' | 'className' | 'readOnly'
> & {
    value: number;
    onChange: { (value: number): void }
    width?: number
    height?: number
}


const horizontalSliderContainerStyle = (width: number): CSSProperties => ({
    flexBasis: width,
    maxWidth: width,
    flexGrow: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
})

export const VerticalRange = ({ value, onChange, width = 20, height = 100, min, max, step }: Props) => {

    return (
        <div style={horizontalSliderContainerStyle(width)}>
            <input type="range"
                style={{
                    width: height,
                    transform: 'rotate(90deg)',
                }}
                min={min} max={max} step={step}
                value={value}
                onChange={(e) =>
                    onChange(Number(e.target.value))
                } />
        </div>
    )
}