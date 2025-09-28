import styles from "./CommandBuilder.module.css";
import { useState } from "react";
import { Frame, Input, Button, Tooltip, Fieldset, Checkbox } from "@react95/core";
import { Copy, Tick } from "@react95/icons";

type Option = {
  option: string,
  description: string,
  type: string,
}

type CommandProps = {
  description: string,
  syntax: string,
  options?: Option[],
}

export default function CommandBuilderItem({ description, syntax, options }: CommandProps) {
  const [copied, setCopied] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [buildCommand, setBuildCommand] = useState("");

  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText(buildCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('コピーに失敗しました', error);
    }
  };

  const handleShortOptionChange = (option: string, checked: boolean) => {
    let newOptions: string[];
    if (checked) {
      newOptions = [...selectedOptions, option];
    } else {
      newOptions = selectedOptions.filter((o) => o !== option);
    }
    setSelectedOptions(newOptions);

    const optionsPart = newOptions.length > 0 ? `-${newOptions.join("")}` : "[options]";
    const buildCommand = syntax.replace("[options]", optionsPart);

    // コマンド組み立て
    setBuildCommand(buildCommand);
  };

  return (
    <Frame
      display="flex"
      flexDirection="column"
      gap="$4"
      mb="$4"
    >
      <div className={styles.commandContainer}>
        <Tooltip text={description} delay={100} style={{ width: '100%'}} className={styles.inputWrapper}>
          <Input fontFamily="monospace" placeholder={syntax} value={buildCommand} readOnly/>
        </Tooltip>
        <Button onClick={copyCommand}>
          {copied ? <Tick variant="16x16_4" /> : <Copy variant="16x16_4" />}
        </Button>
      </div>
      <div>
        <Fieldset legend="Options">
          <Frame
            display="grid" // gridレイアウト
            gridTemplateColumns="repeat(2, 1fr)" // 2列指定。frは利用可能なスペースを分割する単位
            gap="$2"
          >
            {options
              ?.filter((o) => o.type === "short")
              .map((o, idx) => (
              <Checkbox
                key={idx}
                checked={selectedOptions.includes(o.option)}
                onChange={(e) => handleShortOptionChange(o.option, e.currentTarget.checked)}
              >
                {`${o.option} : ${o.description}`}
              </Checkbox>
            ))}
          </Frame>
        </Fieldset>
        {/* <Fieldset legend="Options(required param)">
          <Frame
            display="flex"
            flexDirection="column"
            gap="$2"
          >
            {options
              .filter((o) => o.type === "short-arg")
              .map((o, idx) => (
                <div key={idx} className={styles.optionWithInput}>
                  <Checkbox
                    key={idx}
                    checked={selectedOptions.includes(o.option)}
                  >
                    {`${o.option} : ${o.description}`}
                  </Checkbox>
                  <Input
                    className={styles.optionInput}
                    value=""
                  />
                </div>
            ))}
          </Frame>
        </Fieldset> */}
      </div>
    </Frame>
  );
}
