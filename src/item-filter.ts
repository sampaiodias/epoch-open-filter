import {Rule} from "./rule";
import {ItemFilterIcon} from "./item-filter-icon";
import {ItemFilterIconColor} from "./item-filter-icon-color";

export interface ItemFilter {
    name: string;
    filterIcon: number;
    filterIconEnum: ItemFilterIcon
    filterIconColor: number;
    filterIconColorEnum: ItemFilterIconColor
    description: string;
    lastModifiedInVersion: string;
    lootFilterVersion: number;
    rules: Rule[];
}