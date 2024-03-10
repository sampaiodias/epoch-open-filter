import {fromXml, toXml} from "./src";
import {ItemFilter} from "./src/item-filter";
import * as assert from "assert";

const initialXml: string = `<?xml version="1.0" encoding="utf-8"?>
<ItemFilter xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
  <name>Filter Test</name>
  <filterIcon>2</filterIcon>
  <filterIconColor>1</filterIconColor>
  <description>description</description>
  <lastModifiedInVersion>1.0.1</lastModifiedInVersion>
  <lootFilterVersion>1</lootFilterVersion>
  <rules>
    <Rule>
      <type>HIDE</type>
      <conditions>
        <Condition i:type="ClassCondition">
          <req>Primalist Mage</req>
        </Condition>
      </conditions>
      <color>0</color>
      <isEnabled>true</isEnabled>
      <levelDependent>false</levelDependent>
      <minLvl>0</minLvl>
      <maxLvl>0</maxLvl>
      <emphasized>false</emphasized>
      <nameOverride />
    </Rule>
    <Rule>
      <type>SHOW</type>
      <conditions>
        <Condition i:type="RarityCondition">
          <rarity>NORMAL MAGIC</rarity>
        </Condition>
      </conditions>
      <color>0</color>
      <isEnabled>true</isEnabled>
      <levelDependent>true</levelDependent>
      <minLvl>0</minLvl>
      <maxLvl>3</maxLvl>
      <emphasized>false</emphasized>
      <nameOverride />
    </Rule>
    <Rule>
      <type>SHOW</type>
      <conditions>
        <Condition i:type="RarityCondition">
          <rarity>RARE EXALTED UNIQUE SET</rarity>
        </Condition>
      </conditions>
      <color>0</color>
      <isEnabled>true</isEnabled>
      <levelDependent>false</levelDependent>
      <minLvl>0</minLvl>
      <maxLvl>0</maxLvl>
      <emphasized>true</emphasized>
      <nameOverride />
    </Rule>
  </rules>
</ItemFilter>`;

const itemFilter: ItemFilter = fromXml(initialXml);
const filterToXml = toXml(itemFilter);
const formattedXml = filterToXml.replace(/<(\w+)([^>]*)\/>/g, '<$1$2 />'); // Add a space to self-closed tags
assert.deepEqual(formattedXml, initialXml, 'The original XML is not the same as the generated XML');

console.log('All tests passed!')