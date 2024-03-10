import {Rule} from "./rule";

export interface ItemFilter {
    name: string;
    filterIcon: number;
    filterIconColor: number;
    description: string;
    lastModifiedInVersion: string;
    lootFilterVersion: number;
    rules: Rule[];
}

