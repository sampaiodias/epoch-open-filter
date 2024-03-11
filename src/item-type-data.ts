import {ItemType} from "./item-type";
import {ItemSubTypeData} from "./item-sub-type-data";

export interface ItemTypeData {
    id: number,
    name: string;
    subTypes: ItemSubTypeData[];
    enum: ItemType;
}