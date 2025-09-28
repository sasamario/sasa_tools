import { Tabs, Tab } from "@react95/core";
import { commandBuilder } from "../../config/commandBuilder";
import CommandBuilderItem from "./CommandBuilderItem";

export default function CommandBuilder() {
  return (
    <Tabs width="650px">
      {Object.entries(commandBuilder).map(([key, item]) => (
        <Tab key={key} title={key}>
          <CommandBuilderItem
            key={item.command}
            description={item.description}
            syntax={item.syntax}
            options={item.options}
          />
        </Tab>
      ))}
    </Tabs>
  );
}
