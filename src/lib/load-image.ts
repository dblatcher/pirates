
export const loadImage = async (src: string, width: number, height: number): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const image = new Image(width, height)
        image.src = src
        image.addEventListener('load', () => resolve(image), { once: true })
        image.addEventListener('error', (event) => reject(event), { once: true })
    })
}