import {Condition} from "./condition";
import {LevelConditionType} from "./level-condition-type";

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