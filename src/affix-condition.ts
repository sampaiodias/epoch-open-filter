import {Condition} from "./condition";
import {Comparison} from "./comparison";

export class AffixCondition implements Condition {
    type: string;
    /**
     * See index.affixData() for affix ids
     */
    affixes: number[];
    advanced: boolean;
    comparison: Comparison;
    comparisonValue: number;
    minOnTheSameItem: number;
    combinedComparison: Comparison;
    combinedComparisonValue: number;

    constructor(affixes: number[], advanced: boolean, comparison: string, comparisonValue: number, minOnTheSameItem: number, combinedComparison: string, combinedComparisonValue: number) {
        this.type = 'AffixCondition'
        this.affixes = affixes;
        this.advanced = advanced;
        this.comparison = this.parseComparison(comparison);
        this.comparisonValue = comparisonValue;
        this.minOnTheSameItem = minOnTheSameItem;
        this.combinedComparison = this.parseComparison(combinedComparison);
        this.combinedComparisonValue = combinedComparisonValue;
    }

    parseComparison(c: string): Comparison {
        const key = Object.keys(Comparison).find(key => Comparison[key as keyof typeof Comparison] === c);
        return key ? Comparison[key as keyof typeof Comparison] : Comparison.ANY;
    }
}