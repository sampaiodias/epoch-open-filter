import {fromXml} from "./index";
import {ItemFilter} from "./item-filter";

const xmlString: string = `
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
</ItemFilter>
`;

const itemFilter: ItemFilter = fromXml(xmlString);
console.log(itemFilter);