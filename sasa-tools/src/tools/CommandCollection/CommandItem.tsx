import { Frame, Input, Button } from "@react95/core";
import { Copy } from "@react95/icons";

type CommandItemProps = { 
  command: string,
  description: string
};

export default function CommandItem({ command, description }: CommandItemProps) {
  const copyCommand = () => navigator.clipboard.writeText(command);
  return (
    <Frame display={'flex'} gap="$4" mb="$4">
      <Input w="100%" fontFamily="monospace" value={command} />
      <Button onClick={copyCommand}>
        <Copy />
      </Button>
    </Frame>
  );
}
