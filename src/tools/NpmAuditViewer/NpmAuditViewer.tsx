import styles from "./NpmAuditViewer.module.css";
import { useState } from "react";
import { TextArea, Button, Checkbox, Fieldset, Frame } from "@react95/core";

const fieldItems = [
	{ key: "name", label: "パッケージ名" },
	{ key: "severity", label: "重大度" },
	{ key: "isDirect", label: "直依存かどうか" },
	{ key: "range", label: "脆弱性が含まれているバージョン範囲" },
	{ key: "fixAvailable", label: "fixコマンドで解消できるかどうか" },
];

export default function NpmAuditViewer() {
	const [inputText, setInputText] = useState("");
	const [csvText, setCsvText] = useState("");
	const [selectedFields, setSelectedFields] = useState<string[]>(fieldItems.map((item) => item.key));
  const [auditSummary, setAuditSummary] = useState({
    info: 0,
    low: 0,
    moderate: 0,
    high: 0,
    critical: 0,
    total: 0,
  });

  // CSVエスケープ関数
  // 値にカンマ、改行、ダブルクォートが含まれている場合はダブルクォートで囲み、ダブルクォート自体は2つのダブルクォートに置換する
	const escapeCsv = (value: any) => {
		if (value === null || value === undefined) return "";
		const s = typeof value === "string" ? value : JSON.stringify(value);
		if (s.includes('"')) {
			return '"' + s.replace(/"/g, '""') + '"';
		}
		if (s.includes(",") || s.includes("\n") || s.includes("\r") || s.includes(' ')) {
			return '"' + s + '"';
		}
		return s;
	};

  // 入力されたyarn audit --jsonの出力を解析してCSVに変換
	const convertToCsv = () => {
    const headers = fieldItems.filter((item) => selectedFields.includes(item.key)).map((item) => item.key);
    if (headers.length === 0) {
      alert("抽出項目を1つ以上選択してください");
      setCsvText("");
      return;
    }

    const rows: string[] = [];
    try {
      const input = inputText.trim();
      const parseInput = JSON.parse(input);
      const summaryInfo = parseInput.metadata.vulnerabilities || {};
      const vulnerabilities = parseInput.vulnerabilities || {};

      if (summaryInfo.length === 0 || vulnerabilities.length === 0) {
        alert("有効なnpm audit --jsonの出力を入力してください");
        setCsvText("");
        return;
      }

      // audit summaryセット
      setAuditSummary({
        info: summaryInfo.info,
        low: summaryInfo.low,
        moderate: summaryInfo.moderate,
        high: summaryInfo.high,
        critical: summaryInfo.critical,
        total: summaryInfo.total,
      });

      for (const [packageName, packageInfo] of Object.entries(vulnerabilities)) {
        const row = headers.map((h) => escapeCsv(getVulnerabilityValue(packageInfo, h))).join(",");
        rows.push(row);
      }
    } catch (e) {
      console.error(e);
    }

		setCsvText(headers.join(",") + "\n" + rows.join("\n"));
	};

  // vulnerabilitiesオブジェクトから指定されたキーの値を取得する
  const getVulnerabilityValue = (packageInfo: any, key: string) => {
    switch (key) {
      case "name":
        return packageInfo.name;
      case "severity":
        return packageInfo.severity;
      case "isDirect":
        return packageInfo.isDirect;
      case "range":
        return packageInfo.range;
      case "fixAvailable":
        return packageInfo.fixAvailable;
      default:
        return "";
    }
  };

  // CSVテキストをクリップボードにコピー
	const copyCsv = async () => {
		try {
			await navigator.clipboard.writeText(csvText);
		} catch (e) {
			console.error(e);
		}
	};

  // 入力欄にサンプルのyarn audit --jsonの出力をセット
  const copyAuditSample = () => {
    const sample = `{"auditReportVersion":2,"vulnerabilities":{"vite":{"name":"example-package","severity":"high","isDirect":true,"via":[],"effects":[],"range":"7.0.0 - 7.3.1","nodes":["node_modules/example-package2"],"fixAvailable":true}},"metadata":{"vulnerabilities":{"info":0,"low":0,"moderate":0,"high":1,"critical":0,"total":1},"dependencies":{"prod":24,"dev":226,"optional":47,"peer":11,"peerOptional":0,"total":260}}}`;
    setInputText(sample);
  }

  // チェックボックスのオンオフでselectedFieldsを更新
	const toggleField = (key: string, checked: boolean) => {
		setSelectedFields((prev) => {
			if (checked) {
				return [...prev, key];
			}

      // チェックが外された場合は、prevからkeyを除外して新しい配列を返す
			return prev.filter((item) => item !== key);
		});
	};

	return (
    <div className={styles.container}>
      <h2 className={styles.title}>Npm Audit Viewer</h2>
      <section className={styles.main}>
        <div className={styles.section}>
          <Fieldset legend="抽出項目">
            <Frame
              display="grid"
              gridTemplateColumns="repeat(2, 1fr)"
              gap="$2"
            >
              {fieldItems.map((item) => (
                <label key={item.key} className={styles.checkboxItem}>
                  <Checkbox
                    checked={selectedFields.includes(item.key)}
                    onChange={(e: any) => toggleField(item.key, e.currentTarget.checked)}
                  />
                  <span>{item.key}: {item.label}</span>
                </label>
              ))}
            </Frame>
          </Fieldset>
        </div>

        <div className={styles.viewerWrapper}>
          <div className={styles.summaryPane}>
            <div className={styles.summaryTitle}>Audit Summary</div>
            <div className={styles.summaryContent}>
              <div className={styles.summaryItem}>
                <span className={styles.severityLabel}>Critical:</span>
                <span className={styles.severityValue}>{auditSummary.critical}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.severityLabel}>High:</span>
                <span className={styles.severityValue}>{auditSummary.high}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.severityLabel}>Moderate:</span>
                <span className={styles.severityValue}>{auditSummary.moderate}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.severityLabel}>Low:</span>
                <span className={styles.severityValue}>{auditSummary.low}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.severityLabel}>Info:</span>
                <span className={styles.severityValue}>{auditSummary.info}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.severityLabel}>Total:</span>
                <span className={styles.severityValue}>{auditSummary.total}</span>
              </div>
            </div>
          </div>

          <div className={styles.editorRow}>
            <div className={styles.editorPane}>
              <div className={styles.fieldTitle}>npm audit --json を貼り付け</div>
              <TextArea
                value={inputText}
                onChange={(e: any) => setInputText(e.target.value)}
                rows={20}
                wrap="off"
                className={styles.textArea}
              />
            </div>

            <div className={styles.gutter} />

            <div className={styles.editorPane}>
              <div className={styles.fieldTitle}>CSV 出力</div>
              <TextArea
                value={csvText}
                readOnly
                rows={20}
                wrap="off"
                className={styles.textArea}
              />
            </div>
          </div>

          <div className={styles.buttonRow}>
            <Button onClick={copyAuditSample}>サンプル</Button>
            <Button onClick={convertToCsv}>出力</Button>
            <Button onClick={copyCsv} disabled={!csvText}>コピー</Button>
          </div>
        </div>
      </section>
    </div>
	);
}