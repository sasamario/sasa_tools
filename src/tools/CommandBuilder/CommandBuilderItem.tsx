import styles from "./CommandBuilder.module.css";
import { useEffect, useState } from "react";
import { Frame, Input, Button, Tooltip, Fieldset, Checkbox } from "@react95/core";
import { Copy, Tick } from "@react95/icons";
import CommandBuilderGrep from "./CommandBuilderGrep";

type Option = {
  option: string,
  description: string,
  type: string,
}

type CommandProps = {
  command: string,
  description: string,
  syntax: string,
  options?: Option[],
}

export default function CommandBuilderItem({ command, description, syntax, options }: CommandProps) {
  const [copied, setCopied] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [parameters, setParameters] = useState<{ [key: string]: string }>({});
  const [buildCommand, setBuildCommand] = useState("");

  // コマンドを組み立てる
  useEffect(() => {
    let buildCommand = syntax;

    // オプション部分の組み立て
    const optionsPart = selectedOptions.length > 0 ? `-${selectedOptions.join("")}` : "[options]";
    buildCommand = buildCommand.replace("[options]", optionsPart);

    // パラメータ部分の組み立て
    Object.entries(parameters).forEach(([key, value]) => {
      buildCommand = buildCommand.replace(key, value);
    });
    
    setBuildCommand(buildCommand);
  }, [syntax, parameters, selectedOptions]);

  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText(buildCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('コピーに失敗しました', error);
    }
  };

  // オプション更新
  const updateCommandOptions = (option: string, checked: boolean) => {
    let newOptions: string[];
    if (checked) {
      newOptions = [...selectedOptions, option];
    } else {
      newOptions = selectedOptions.filter((o) => o !== option);
    }
    setSelectedOptions(newOptions);
  };

  // パラメータ更新
  const updateCommandParameters = (replaceText: string, replaceValue: string) => {
    // replaceValueが空の場合は、parametersから削除
    if (replaceValue.trim() === "") {
      // _は、任意の変数名で、ここでは使わないことを示す
      // 分割代入でkeyがreplaceTextの値を_として取得。それ以外をrestとして受け取る（要はreplaceTextを削除している）
      const { [replaceText]: _, ...rest } = parameters;
      setParameters(rest);
    } else {
      setParameters((prev) => ({ ...prev, [replaceText]: replaceValue }));
    }
  }
  

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
                onChange={(e) => updateCommandOptions(o.option, e.currentTarget.checked)}
              >
                {`${o.option} : ${o.description}`}
              </Checkbox>
            ))}
          </Frame>
        </Fieldset>
        {command === "grep" && (
          <CommandBuilderGrep
            updateCommandParameters={updateCommandParameters}
          />
        )}
      </div>
    </Frame>
  );
}
