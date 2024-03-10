import {ItemFilter} from "./item-filter";
import {xml2json} from 'xml-js';
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

export function toXml(lootFilter: ItemFilter): string {
    return "";
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
                   rule.maxLvl = parseInt(rElement.elements[0].text, 10);
                   break;
               case 'maxLvl':
                   rule.minLvl = parseInt(rElement.elements[0].text, 10);
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
        }
    });
    return conditions;
}