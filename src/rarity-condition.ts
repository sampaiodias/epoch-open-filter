import {Condition} from "./condition";
import {Rarity} from "./rarity";

export class RarityCondition implements Condition {
    rarity: string;
    type: string;
    rarityList: Rarity[];

    constructor(rarity: string) {
        this.type = 'RarityCondition'
        this.rarity = rarity;
        this.rarityList = this.parseRarity(this.rarity);
    }

    parseRarity(rarity: string): Rarity[] {
        return rarity.split(' ').map(r => {
            const key = Object.keys(Rarity).find(key => Rarity[key as keyof typeof Rarity] === r.toUpperCase());
            return key ? Rarity[key as keyof typeof Rarity] : undefined;
        }).filter((r): r is Rarity => r !== undefined);
    }
}