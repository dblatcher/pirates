import { useContext } from "react";
import { AssetContext } from "../context/asset-context";

export const useAssets = () => useContext(AssetContext).assets