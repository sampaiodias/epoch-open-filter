import {ItemFilter} from "./item-filter";
import {js2xml, xml2json} from 'xml-js';
import {Rule} from "./rule";
import {Condition} from "./condition";
import {ClassCondition} from "./class-condition";
import {RarityCondition} from "./rarity-condition";
import {SubTypeCondition} from "./sub-type-condition";
import {ItemFilterIcon} from "./item-filter-icon";
import {ItemFilterIconColor} from "./item-filter-icon-color";
import {readFile} from "fs/promises";
import {ItemTypeData} from "./item-type-data";
import {Affix} from "./affix";
import {LevelCondition} from "./level-condition";
import {AffixCondition} from "./affix-condition";
import {LevelConditionType} from "./level-condition-type";

export type XmlElement = {
    type: string;
    name: string;
    elements: XmlElement[];
    text: string;
    attributes: { [key: string]: string };
};

export function fromXml(xml: string): ItemFilter {
    let itemFilter: ItemFilter = {
        description: "",
        filterIcon: 0,
        filterIconEnum: ItemFilterIcon.None,
        filterIconColor: 0,
        filterIconColorEnum: ItemFilterIconColor.None,
        lastModifiedInVersion: "",
        lootFilterVersion: 0,
        name: "",
        rules: []
    };
    const json = JSON.parse(xml2json(xml));
    const elements = json.elements.find((e: XmlElement) => e.name === 'ItemFilter').elements;
    elements.forEach((element: XmlElement) => {
        switch (element.name) {
            case 'name':
                itemFilter.name = element.elements[0].text;
                break;
            case 'filterIcon':
                itemFilter.filterIcon = parseInt(element.elements[0].text, 10);
                const iconKey = Object.keys(ItemFilterIcon).find(key => ItemFilterIcon[key as keyof typeof ItemFilterIcon] === itemFilter.filterIcon);
                itemFilter.filterIconEnum = iconKey ? ItemFilterIcon[iconKey as keyof typeof ItemFilterIcon] : ItemFilterIcon.None;
                break;
            case 'filterIconColor':
                itemFilter.filterIconColor = parseInt(element.elements[0].text, 10);
                const iconColorKey = Object.keys(ItemFilterIconColor).find(key => ItemFilterIconColor[key as keyof typeof ItemFilterIconColor] === itemFilter.filterIconColor);
                itemFilter.filterIconColorEnum = iconColorKey ? ItemFilterIconColor[iconColorKey as keyof typeof ItemFilterIconColor] : ItemFilterIconColor.None;
                break;
            case 'description':
                itemFilter.description = element.elements[0].text;
                break;
            case 'lastModifiedInVersion':
                itemFilter.lastModifiedInVersion = element.elements[0].text;
                break;
            case 'lootFilterVersion':
                itemFilter.lootFilterVersion = parseInt(element.elements[0].text, 10);
                break;
            case 'rules':
                itemFilter.rules = mapRules(element.elements);
                break;
        }
    });

    return itemFilter;
}

export function toXml(itemFilter: ItemFilter): string {
    const itemFilterObj = {
        _declaration: {
            _attributes: {
                version: "1.0",
                encoding: "utf-8"
            }
        },
        ItemFilter: {
            _attributes: {
                'xmlns:i': "http://www.w3.org/2001/XMLSchema-instance"
            },
            name: { _text: itemFilter.name },
            filterIcon: { _text: itemFilter.filterIcon.toString() },
            filterIconColor: { _text: itemFilter.filterIconColor.toString() },
            description: { _text: itemFilter.description },
            lastModifiedInVersion: { _text: itemFilter.lastModifiedInVersion },
            lootFilterVersion: { _text: itemFilter.lootFilterVersion.toString() },
            rules: {
                Rule: itemFilter.rules.map(rule => ({
                    type: { _text: rule.type },
                    conditions: {
                        Condition: rule.conditions.map(condition => {
                            let conditionObj: any = {
                                _attributes: { "i:type": condition.type }
                            };
                            if (condition.type === 'RarityCondition') {
                                conditionObj.rarity = { _text: (condition as RarityCondition).rarity };
                            } else if (condition.type === 'ClassCondition') {
                                conditionObj.req = { _text: (condition as ClassCondition).req };
                            } else if (condition.type === 'SubTypeCondition') {
                                const c = (condition as SubTypeCondition);
                                conditionObj.type = c.types.map(t => {
                                    return {EquipmentType: t}
                                });
                                const sList = c.subTypes.map(s => ({ int: s }));
                                conditionObj.subTypes = { int: sList.map(s => s.int) };
                            } else if (condition.type === 'LevelCondition') {
                                const lc = (condition as LevelCondition);
                                conditionObj.treshold = {_text: lc.threshold}; // Yes, the filter from EHG has a typo
                                conditionObj.type = {_text: lc.levelConditionType};
                            } else if (condition.type === 'AffixCondition') {
                                const ac = (condition as AffixCondition);
                                const affixes = ac.affixes.map(affix => ({ int: affix }));
                                conditionObj.affixes = { int: affixes.map(affix => affix.int) };
                                conditionObj.comparsion = {_text: ac.comparison};
                                conditionObj.comparsionValue = {_text: ac.comparisonValue};
                                conditionObj.minOnTheSameItem = {_text: ac.minOnTheSameItem};
                                conditionObj.combinedComparsion = {_text: ac.combinedComparison};
                                conditionObj.combinedComparsionValue = {_text: ac.combinedComparisonValue};
                                conditionObj.advanced = {_text: ac.advanced};
                            }
                            return conditionObj;
                        })
                    },
                    color: rule.color,
                    isEnabled: rule.isEnabled,
                    levelDependent: rule.levelDependent,
                    minLvl: rule.minLvl,
                    maxLvl: rule.maxLvl,
                    emphasized: rule.emphasized,
                    nameOverride: rule.nameOverride,
                }))
            }
        }
    };

    const options = { compact: true, ignoreComment: true, spaces: 2 };
    return js2xml(itemFilterObj, options);
}

export async function itemTypeData(): Promise<ItemTypeData[]> {
    let json = await readFile('src/data/item-types.json', {encoding: 'utf-8'});
    return JSON.parse(json);
}

export async function affixData(): Promise<Affix[]> {
    let json = await readFile('src/data/affixes.json', {encoding: 'utf-8'});
    return JSON.parse(json);
}

function mapRules(rulesElements: XmlElement[]): Rule[] {
    let rules: Rule[] = [];
    rulesElements.forEach((element: XmlElement) => {
        const i = element.elements;
        let rule: Rule = {
            color: 0,
            conditions: [],
            emphasized: false,
            isEnabled: false,
            levelDependent: false,
            maxLvl: 0,
            minLvl: 0,
            nameOverride: null,
            type: ""
        };
        i.forEach((rElement: XmlElement) => {
           switch (rElement.name) {
               case 'type':
                   rule.type = rElement.elements[0].text;
                   break;
               case 'color':
                   rule.color = parseInt(rElement.elements[0].text, 10);
                   break;
               case 'isEnabled':
                   rule.isEnabled = rElement.elements[0].text === 'true';
                   break;
               case 'levelDependent':
                   rule.levelDependent = rElement.elements[0].text === 'true';
                   break;
               case 'minLvl':
                   rule.minLvl = parseInt(rElement.elements[0].text, 10);
                   break;
               case 'maxLvl':
                   rule.maxLvl = parseInt(rElement.elements[0].text, 10);
                   break;
               case 'emphasized':
                   rule.emphasized = rElement.elements[0].text === 'true';
                   break;
               case 'nameOverride':
                   rule.nameOverride = element.elements[0].text;
                   break;
               case 'conditions':
                   rule.conditions = mapConditions(rElement.elements);
                   break;
           }
        });
        rules.push(rule);
    });
    return rules;
}

function mapConditions(conditionsElements: XmlElement[]): Condition[] {
    let conditions: Condition[] = [];
    conditionsElements.forEach((condElement: XmlElement) => {
        let condition: Condition = {
            type: condElement.attributes["i:type"]
        };

        if (condition.type === "ClassCondition") {
            const classCondition = new ClassCondition(condElement.elements[0].elements[0].text);
            conditions.push(classCondition);
        } else if (condition.type === "RarityCondition") {
            const rarityCondition: RarityCondition = new RarityCondition(condElement.elements[0].elements[0].text);
            conditions.push(rarityCondition);
        } else if (condition.type === "SubTypeCondition") {
            const types: string[] = condElement.elements[0].elements[0].elements.map(e => e.text);
            const subTypes: number[] = condElement.elements[1].elements.map(e => parseInt(e.elements[0].text));
            const subTypeCondition: SubTypeCondition = new SubTypeCondition(types, subTypes);
            conditions.push(subTypeCondition);
        } else if (condition.type === "LevelCondition") {
            let levelConditionType = condElement.elements.find(x => x.name == 'type')?.elements[0]?.text;
            if (levelConditionType) {
                let threshold = condElement.elements.find(x => x.name == 'treshold')?.elements[0]?.text; // Yes, the filter from EHG has a typo
                if (!threshold) {
                    threshold = '0';
                }
                const levelCondition: LevelCondition = new LevelCondition(parseInt(threshold, 10), levelConditionType);
                conditions.push(levelCondition);
            }
        } else if (condition.type === "AffixCondition") {
            const affixes = condElement.elements.find(x => x.name == 'affixes')?.elements.map(e => {
                return parseInt(e.elements[0].text);
            });
            const minOnTheSameItem = condElement.elements.find(x => x.name == 'minOnTheSameItem')?.elements[0]?.text;
            const advanced = condElement.elements.find(x => x.name == 'advanced')?.elements[0]?.text;
            // Yes, the filter from EHG has typos
            const comparison = condElement.elements.find(x => x.name == 'comparsion')?.elements[0]?.text;
            const comparisonValue = condElement.elements.find(x => x.name == 'comparsionValue')?.elements[0]?.text;
            const combinedComparison = condElement.elements.find(x => x.name == 'combinedComparsion')?.elements[0]?.text;
            const combinedComparisonValue = condElement.elements.find(x => x.name == 'combinedComparsionValue')?.elements[0]?.text;

            const affixCondition: AffixCondition = new AffixCondition(
                affixes ? affixes : [],
                advanced == 'true',
                comparison ? comparison : '',
                comparisonValue ? parseInt(comparisonValue) : 0,
                minOnTheSameItem ? parseInt(minOnTheSameItem) : 0,
                combinedComparison ? combinedComparison : '',
                combinedComparisonValue ? parseInt(combinedComparisonValue) : 0
            );
            conditions.push(affixCondition);
        }
    });
    return conditions;
}