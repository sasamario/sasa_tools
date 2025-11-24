import styles from "./CommandBuilder.module.css";
import { Tooltip, Input, Fieldset } from "@react95/core";
import { useState } from "react";

type CommandBuilderGrepProps = {
  updateCommandParameters: (replaceText: string, replaceValue: string) => void;
}

export default function CommandBuilderGrep({ updateCommandParameters }: CommandBuilderGrepProps) {
  const [searchPattern, setSearchPattern] = useState<string>("");
  const [targetFile, setTargetFile] = useState<string>("");

  const handleChangeSearchPattern = (e: React.ChangeEvent<HTMLInputElement>) => {
    // パターン変更時の処理
    const searchPattern = e.target.value;
    setSearchPattern(searchPattern);

    if (searchPattern.trim() === "") {
      updateCommandParameters("<pattern>", "");
    } else {
      updateCommandParameters("<pattern>", `'${searchPattern}'`);
    }
  }

  const handleChangeTargetFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    // ターゲットファイル変更時の処理
    const targetFile = e.target.value;
    setTargetFile(targetFile);

    if (targetFile.trim() === "") {
      updateCommandParameters("[file]", "");
    } else {
      updateCommandParameters("[file]", targetFile);
    }
  }

  return (
    <>
      <Fieldset legend="Pattern">
        <Tooltip text="検索パターン" delay={100} style={{ width: '100%'}} className={styles.inputWrapper}>
          <Input
            placeholder="pattern"
            value={searchPattern}
            onChange={handleChangeSearchPattern}
          />
        </Tooltip>
      </Fieldset>
      <Fieldset legend="File or Directory">
        <Tooltip text="検索対象ファイル（またはディレクトリ）" delay={100} style={{ width: '100%'}} className={styles.inputWrapper}>
          <Input
            placeholder="file or directory"
            value={targetFile}
            onChange={handleChangeTargetFile}
          />
        </Tooltip>
      </Fieldset>
    </>
  );
}