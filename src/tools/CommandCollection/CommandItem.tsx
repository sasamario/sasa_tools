import { Frame, Input, Button, Tooltip } from "@react95/core";
import { Copy } from "@react95/icons";

type CommandItemProps = { 
  command: string,
  description: string
};

export default function CommandItem({ command, description }: CommandItemProps) {
  const copyCommand = () => navigator.clipboard.writeText(command);
  return (
    <Frame display={'flex'} gap="$4" mb="$4">
      <Tooltip text={description} delay={100} style={{ width: '100%'}}>
        <Input w="100%" h="100%" fontFamily="monospace" value={command} readOnly/>
      </Tooltip>
      <Button onClick={copyCommand}>
        <Copy />
      </Button>
    </Frame>
  );
}
