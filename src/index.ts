import {ItemFilter} from "./item-filter";
import {js2xml, xml2json} from 'xml-js';
import {Rule} from "./rule";
import {Condition} from "./condition";
import {ClassCondition} from "./class-condition";
import {RarityCondition} from "./rarity-condition";

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
        filterIconColor: 0,
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
                break;
            case 'filterIconColor':
                itemFilter.filterIconColor = parseInt(element.elements[0].text, 10);
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

function mapConditions(conditionsElements: XmlElement[]): Condition<any>[] {
    let conditions: Condition<any>[] = [];
    conditionsElements.forEach((condElement: XmlElement) => {
        let condition: Condition<any> = {
            type: condElement.attributes["i:type"]
        };

        if (condition.type === "ClassCondition") {
            const classCondition = new ClassCondition(condElement.elements[0].elements[0].text);
            conditions.push(classCondition);
        } else if (condition.type === "RarityCondition") {
            const rarityCondition: RarityCondition = new RarityCondition(condElement.elements[0].elements[0].text);
            conditions.push(rarityCondition);
        }
    });
    return conditions;
}