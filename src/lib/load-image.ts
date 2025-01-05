
export type AssetData = {
    src: string,
    sprites?: {
        cols: number,
        rows: number,
    }
}

type GenericAssetMap<Key extends string> = Record<Key, HTMLImageElement>;

export const loadImage = async (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const image = new Image()
        image.src = src
        image.addEventListener('load', () => resolve(image), { once: true })
        image.addEventListener('error', (event) => reject(event), { once: true })
    })
}

export const loadAssets = async <Key extends string,>(assetParams: Record<Key, AssetData>): Promise<GenericAssetMap<Key>> => {
    const images = await Promise.all(Object.values<AssetData>(assetParams).map((assetData) => loadImage(assetData.src)))
    const assetMap: Partial<GenericAssetMap<Key>> = {}
    Object.keys(assetParams).forEach((key, index) => {
        assetMap[key as Key] = images[index]
    })
    return assetMap as GenericAssetMap<Key>
}