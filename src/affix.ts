import {AffixTier} from "./affix-tier";

export interface Affix {
    id: number
    name: string,
    displayName: string,
    prefixSuffixName: string,
    levelRequirement: number,
    category: string,
    tiers: AffixTier[]
}

