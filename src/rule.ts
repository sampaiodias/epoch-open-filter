import {Condition} from "./condition";

export interface Rule {
    type: string;
    conditions: Condition[];
    color: number;
    isEnabled: boolean;
    levelDependent: boolean;
    minLvl: number;
    maxLvl: number;
    emphasized: boolean;
    nameOverride: string | null;
}