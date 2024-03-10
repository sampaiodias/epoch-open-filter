import {fromXml, toXml} from "./src";
import {ItemFilter} from "./src/item-filter";
import * as assert from "assert";
import {ItemFilterIcon} from "./src/item-filter-icon";
import {ItemFilterIconColor} from "./src/item-filter-icon-color";

const initialXml: string = `<?xml version="1.0" encoding="utf-8"?>
<ItemFilter xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
  <name>name</name>
  <filterIcon>11</filterIcon>
  <filterIconColor>10</filterIconColor>
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
    <Rule>
      <type>HIGHLIGHT</type>
      <conditions>
        <Condition i:type="SubTypeCondition">
          <type>
            <EquipmentType>ONE_HANDED_AXE</EquipmentType>
          </type>
          <subTypes>
            <int>0</int>
            <int>1</int>
            <int>2</int>
            <int>3</int>
            <int>4</int>
            <int>5</int>
            <int>6</int>
            <int>12</int>
            <int>13</int>
            <int>7</int>
            <int>8</int>
            <int>9</int>
            <int>10</int>
            <int>11</int>
          </subTypes>
        </Condition>
      </conditions>
      <color>1</color>
      <isEnabled>true</isEnabled>
      <levelDependent>false</levelDependent>
      <minLvl>0</minLvl>
      <maxLvl>0</maxLvl>
      <emphasized>false</emphasized>
      <nameOverride />
    </Rule>
  </rules>
</ItemFilter>`;

const itemFilter: ItemFilter = fromXml(initialXml);
assert.equal(itemFilter.filterIconEnum, ItemFilterIcon.Boots);
assert.equal(itemFilter.filterIconColorEnum, ItemFilterIconColor.Green);

const filterToXml = toXml(itemFilter);
const formattedXml = filterToXml.replace(/<(\w+)([^>]*)\/>/g, '<$1$2 />'); // Add a space to self-closed tags
assert.deepEqual(formattedXml, initialXml, 'The original XML is not the same as the generated XML');

console.log('All tests passed!')