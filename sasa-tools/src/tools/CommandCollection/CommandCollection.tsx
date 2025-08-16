import { Tabs, Tab } from "@react95/core";
import { commands } from "../../config/commands";
import CommandItem from "./CommandItem";

export default function CommandCollection() {
  const categories = Object.keys(commands);

  return (
    <Tabs width="650px">
      {categories.map((category) => (
        <Tab title={category}>
          {/* keyof typeof commandsでcommandsのキーのみ許可される型となる */}
          {commands[category as keyof typeof commands].map((c) => (
            <CommandItem command={c.command} description={c.description} />
          ))}
        </Tab>
      ))}
    </Tabs>
  );
}
