import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { loadImage } from "../lib/load-image";
import { assetParams } from "../assets";

type AssetKey = keyof typeof assetParams;

export type AssetMap = Record<AssetKey, HTMLImageElement>;

type AssetContextProps = {
    assets?: AssetMap
}
type AssetProviderProps = {
    children: ReactNode
    assetParams: Record<AssetKey, { src: string, width: number, height: number }>
    loadingContent?: ReactNode
}

const AssetContext = createContext<AssetContextProps>({ assets: undefined })

export const WaitingAssetProvider = ({ children, assetParams, loadingContent }: AssetProviderProps) => {
    const [assetMap, setAssetMap] = useState<AssetMap | undefined>(undefined)
    const loadAssets = async (): Promise<AssetMap> => {
        const images = await Promise.all(Object.values(assetParams).map((params) => loadImage(params.src, params.width, params.height)))
        const assetMap: Partial<AssetMap> = {}
        Object.keys(assetParams).forEach((key, index) => {
            assetMap[key as AssetKey] = images[index]
        })
        return assetMap as AssetMap
    }
    useEffect(() => {
        loadAssets().then(setAssetMap)
    }, [setAssetMap, assetParams])

    if (!assetMap) {
        return loadingContent
    }
    return <AssetContext.Provider value={{
        assets: assetMap
    }}>{children}</AssetContext.Provider>
}

export const useAssets = () => useContext(AssetContext).assets