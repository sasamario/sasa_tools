import styles from "./CommandBuilder.module.css";
import { useEffect, useState } from "react";
import { Frame, Input, Button, Tooltip, Fieldset, Checkbox } from "@react95/core";
import { Copy, Tick } from "@react95/icons";
import CommandBuilderGrep from "./CommandBuilderGrep";
import CommandBuilderFind from "./CommandBuilderFind";

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
  memo: string,
}

export default function CommandBuilderItem({ command, description, syntax, options, memo }: CommandProps) {
  const [copied, setCopied] = useState(false);
  const [selectedShortOptions, setSelectedShortOptions] = useState<string[]>([]);
  // keyがオプション、valueがそのオプションの値（例：{"--name <pattern>": "検索パターン"}）の形でロングオプションの選択状態と値を管理
  const [selectedLongOptions, setSelectedLongOptions] = useState<{ [option: string]: string }>({});
  const [parameters, setParameters] = useState<{ [key: string]: string }>({});
  const [buildCommand, setBuildCommand] = useState("");

  // ロングオプションのフラグを取得（例："--name <pattern>" から "--name" を取得）
  const getLongOptionFlag = (option: string) => option.split(" ")[0];

  // オプションの値を適切にフォーマット（空白を含む場合はクォートで囲む）
  const formatOptionValue = (value: string) => {
    const trimmed = value.trim();
    if (trimmed === "") return "";

    // すでにクォートで囲まれている場合はそのまま返し、そうでない場合はクォートで囲む
    return /^['"].*['"]$/.test(trimmed) ? trimmed : `'${trimmed}'`;
  };

  // コマンドを組み立てる
  useEffect(() => {
    let buildCommand = syntax;

    const shortOptionsPart = selectedShortOptions.length > 0 ? `-${selectedShortOptions.join("")}` : "";
    const longOptionsPart = Object.entries(selectedLongOptions)
      // [, value]は分割代入で、Object.entries()の各要素が[key, value]の形であることを前提に、valueだけを取り出している
      .filter(([, value]) => value.trim() !== "")
      .map(([option, value]) => `-${getLongOptionFlag(option)} ${formatOptionValue(value)}`)
      .join(" ");

    // filter(Boolean)は、空文字列やnull、undefinedなどの「Falsyな値」を除外している。これにより、オプションが選択されていない場合に余分なスペースが入るのを防いでいる
    const optionsPart = [shortOptionsPart, longOptionsPart].filter(Boolean).join(" ");
    buildCommand = buildCommand.replace("[options]", optionsPart || "[options]");

    // パラメータ部分の組み立て
    Object.entries(parameters).forEach(([key, value]) => {
      buildCommand = buildCommand.replace(key, value);
    });
    
    setBuildCommand(buildCommand);
  }, [syntax, parameters, selectedShortOptions, selectedLongOptions]);

  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText(buildCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('コピーに失敗しました', error);
    }
  };

  // ショートオプション更新
  const updateCommandOptions = (option: string, checked: boolean) => {
    let newOptions: string[];
    if (checked) {
      newOptions = [...selectedShortOptions, option];
    } else {
      newOptions = selectedShortOptions.filter((o) => o !== option);
    }
    setSelectedShortOptions(newOptions);
  };

  // ロングオプションの選択／値更新
  const updateCommandLongOptionEnabled = (option: string, checked: boolean) => {
    if (checked) {
      // prevは現在のselectedLongOptionsの状態を表し、スプレッド構文で展開している
      // [option]: valueは、新しいオプションを追加する部分。これでselectedLongOptionsの状態に新しいオプションが追加される。valueは空文字列で初期化している
      setSelectedLongOptions((prev) => ({ ...prev, [option]: prev[option] ?? "" }));
    } else {
      // _は、任意の変数名で、ここでは使わないことを示す
      // 分割代入でkeyがoptionの値を_として取得。それ以外をrestとして受け取る（要はoptionを削除している）
      const { [option]: _, ...rest } = selectedLongOptions;
      setSelectedLongOptions(rest);
    }
  };

  // ロングオプション更新
  const updateCommandLongOptionValue = (option: string, value: string) => {
    setSelectedLongOptions((prev) => ({ ...prev, [option]: value }));
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
        {command === "find" && (
          <CommandBuilderFind
            updateCommandParameters={updateCommandParameters}
          />
        )}
        <Fieldset legend="Options">
          <Frame
            display="grid"
            gridTemplateColumns="repeat(2, 1fr)"
            gap="$2"
          >
            {options
              ?.filter((o) => o.type === "short")
              .map((o, idx) => (
              <Checkbox
                key={idx}
                checked={selectedShortOptions.includes(o.option)}
                onChange={(e) => updateCommandOptions(o.option, e.currentTarget.checked)}
              >
                {`${o.option} : ${o.description}`}
              </Checkbox>
            ))}
          </Frame>
        </Fieldset>
        {options?.some((o) => o.type === "long") && (
          <Fieldset legend="Arguments in Options">
            <Frame display="grid" gap="$2">
              {options
                ?.filter((o) => o.type === "long")
                .map((o, idx) => (
                <div key={idx} className={styles.optionWithInput}>
                  <div className={styles.optionCheckboxRow}>
                    <Checkbox
                      checked={selectedLongOptions[o.option] !== undefined}
                      onChange={(e) => updateCommandLongOptionEnabled(o.option, e.currentTarget.checked)}
                    >
                      {o.option}
                    </Checkbox>
                    <div className={styles.optionDescription}>{o.description}</div>
                  </div>
                  {selectedLongOptions[o.option] !== undefined && (
                    <Input
                      className={styles.optionInput}
                      placeholder={o.option.replace(/^\S+\s*/, "") || "value"}
                      value={selectedLongOptions[o.option] ?? ""}
                      onChange={(e) => updateCommandLongOptionValue(o.option, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </Frame>
          </Fieldset>
        )}
        {command === "grep" && (
          <CommandBuilderGrep
            updateCommandParameters={updateCommandParameters}
          />
        )}
        {memo && (
          <Fieldset legend="Memo">
            <Frame>
              <div className={styles.memo}>{memo}</div>
            </Frame>
          </Fieldset>
        )}
      </div>
    </Frame>
  );
}
