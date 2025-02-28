import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { loadAssets, GenericAssetMap, GenericDataMap } from "@dblatcher/sprite-canvas";
import { AssetKey } from "../assets";


export type AssetMap = GenericAssetMap<AssetKey>;

type AssetContextProps = {
    assets?: AssetMap
}
type AssetProviderProps = {
    children: ReactNode
    assetParams: GenericDataMap<AssetKey>
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