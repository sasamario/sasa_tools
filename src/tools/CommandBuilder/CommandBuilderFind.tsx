import styles from "./CommandBuilder.module.css";
import { Tooltip, Input, Fieldset } from "@react95/core";
import { useState } from "react";

type CommandBuilderFindProps = {
  updateCommandParameters: (replaceText: string, replaceValue: string) => void;
}

export default function CommandBuilderFind({ updateCommandParameters }: CommandBuilderFindProps) {
  const [targetPath, setTargetPath] = useState<string>("");

  const handleChangeTargetPath = (e: React.ChangeEvent<HTMLInputElement>) => {
    // パス変更時の処理
    const targetPath = e.target.value;
    setTargetPath(targetPath);

    if (targetPath.trim() === "") {
      updateCommandParameters("[path]", "");
    } else {
      updateCommandParameters("[path]", targetPath);
    }
  }

  return (
    <>
      <Fieldset legend="Path">
        <Tooltip text="検索対象パス" delay={100} style={{ width: '100%'}} className={styles.inputWrapper}>
          <Input
            placeholder="path"
            value={targetPath}
            onChange={handleChangeTargetPath}
          />
        </Tooltip>
      </Fieldset>
    </>
  );
}