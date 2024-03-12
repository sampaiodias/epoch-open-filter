import {Condition} from "./condition";
import {ItemType} from "./item-type";

export class SubTypeCondition implements Condition {
    type: string;
    types: string[];
    subTypes: number[];
    itemTypeList: ItemType[];

    constructor(types: string[], subTypes: number[]) {
        this.type = 'SubTypeCondition'
        this.types = types;
        this.subTypes = subTypes;
        this.itemTypeList = [];
        types.forEach(t => {
            let parsed = this.parseItemType(t);
            if (!parsed) return;
            this.itemTypeList.push(parsed);
        });
    }

    parseItemType(type: string): ItemType | undefined {
        const key = Object.keys(ItemType).find(key => ItemType[key as keyof typeof ItemType] === type);
        return key ? ItemType[key as keyof typeof ItemType] : undefined;
    }
}