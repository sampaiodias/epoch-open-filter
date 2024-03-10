import {Condition} from "./condition";
import {ItemType} from "./item-type";
import {ItemSubType} from "./item-sub-type";

export class SubTypeCondition implements Condition {
    type: string;
    types: string[];
    subTypes: number[];
    itemTypeList: ItemType[];
    itemSubTypeList: ItemSubType[];

    constructor(types: string[], subTypes: number[]) {
        this.type = 'SubTypeCondition'
        this.types = types;
        this.subTypes = subTypes;
        this.itemTypeList = [];
        this.itemSubTypeList = [];
        types.forEach(t => {
            let parsed = this.parseItemType(t);
            if (!parsed) return;
            this.itemTypeList.push(parsed);
        });
        subTypes.forEach(s => {
            let parsed = this.parseItemSubType(s);
            if (!parsed) return;
            this.itemSubTypeList.push(parsed);
        });
    }

    parseItemType(type: string): ItemType | undefined {
        const key = Object.keys(ItemType).find(key => ItemType[key as keyof typeof ItemType] === type);
        return key ? ItemType[key as keyof typeof ItemType] : undefined;
    }

    parseItemSubType(subType: number): ItemSubType | undefined {
        const key = Object.keys(ItemSubType).find(key => ItemSubType[key as keyof typeof ItemSubType] === subType);
        return key ? ItemSubType[key as keyof typeof ItemSubType] : undefined;
    }
}