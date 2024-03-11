import {Condition} from "./condition";

export class LevelCondition implements Condition {
    type: string;
    levelConditionType: LevelConditionType;
    threshold: number;

    constructor(threshold: number, levelConditionType: string) {
        this.type = 'LevelCondition'
        this.levelConditionType = this.parseLevelConditionType(levelConditionType);
        this.threshold = threshold;
    }

    parseLevelConditionType(type: string): LevelConditionType {
        const key = Object.keys(LevelConditionType).find(key => LevelConditionType[key as keyof typeof LevelConditionType] === type);
        return key ? LevelConditionType[key as keyof typeof LevelConditionType] : LevelConditionType.HIGHEST_USABLE_LEVEL;
    }
}

export enum LevelConditionType {
    BELOW_LEVEL = "BELOW_LEVEL",
    ABOVE_LEVEL = "ABOVE_LEVEL",
    MAX_LVL_BELOW_CHARACTER_LEVEL = "MAX_LVL_BELOW_CHARACTER_LEVEL",
    HIGHEST_USABLE_LEVEL = "HIGHEST_USABLE_LEVEL"
}