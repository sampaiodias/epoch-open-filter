import {Condition} from "./condition";
import {CharacterClass} from "./character-class";

export class ClassCondition implements Condition<string> {
    req: string;
    type: string;
    classList: CharacterClass[];

    constructor(text: string) {
        this.type = 'ClassCondition'
        this.req = text;
        this.classList = this.parseClass(text);
    }

    parseClass(text: string): CharacterClass[] {
        return text.split(' ').map(r => {
            const key = Object.keys(CharacterClass).find(key => CharacterClass[key as keyof typeof CharacterClass] === r);
            return key ? CharacterClass[key as keyof typeof CharacterClass] : undefined;
        }).filter((cc): cc is CharacterClass => cc !== undefined);
    }
}