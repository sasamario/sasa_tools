import { useState } from "react";
import { Frame, Input, Button, Tooltip } from "@react95/core";
import { Copy, Tick } from "@react95/icons";

type CommandItemProps = { 
  command: string,
  description: string
};

export default function CommandItem({ command, description }: CommandItemProps) {
  const [copied, setCopied] = useState(false);

  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('コピーに失敗しました', error);
    }
  }

  return (
    <Frame display={'flex'} gap="$4" mb="$4">
      <Tooltip text={description} delay={100} style={{ width: '100%'}}>
        <Input w="100%" h="100%" fontFamily="monospace" value={command} readOnly/>
      </Tooltip>
      <Button onClick={copyCommand}>
        {copied ? <Tick variant="16x16_4" /> : <Copy variant="16x16_4" />}
      </Button>
    </Frame>
  );
}
