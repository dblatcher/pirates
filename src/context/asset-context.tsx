import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { loadAssets, AssetData } from "@dblatcher/sprite-canvas";
import { assetParams } from "../assets";

type AssetKey = keyof typeof assetParams;

export type AssetMap = Record<AssetKey, HTMLImageElement>;

type AssetContextProps = {
    assets?: AssetMap
}
type AssetProviderProps = {
    children: ReactNode
    assetParams: Record<AssetKey, AssetData>
    loadingContent?: ReactNode
}

const AssetContext = createContext<AssetContextProps>({ assets: undefined })

export const WaitingAssetProvider = ({ children, assetParams, loadingContent }: AssetProviderProps) => {
    const [assetMap, setAssetMap] = useState<AssetMap | undefined>(undefined)
    useEffect(() => {
        loadAssets(assetParams).then(setAssetMap)
    }, [setAssetMap, assetParams])

    if (!assetMap) {
        return loadingContent
    }
    return <AssetContext.Provider value={{
        assets: assetMap
    }}>{children}</AssetContext.Provider>
}

export const useAssets = () => useContext(AssetContext).assets