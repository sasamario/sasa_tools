import styles from "./YarnAuditViewer.module.css";
import { useState } from "react";
import { TextArea, Button, Checkbox, Fieldset, Frame } from "@react95/core";

const fieldItems = [
	{ key: "module_name", label: "パッケージ名" },
	{ key: "severity", label: "重大度" },
	{ key: "version", label: "導入バージョン" },
	{ key: "vulnerable_versions", label: "脆弱性が含まれているバージョン範囲" },
	{ key: "patched_versions", label: "脆弱性修正バージョン範囲" },
	{ key: "title", label: "脆弱性概要" },
];

export default function YarnAuditViewer() {
	const [inputText, setInputText] = useState("");
	const [csvText, setCsvText] = useState("");
	const [selectedFields, setSelectedFields] = useState<string[]>(fieldItems.map((item) => item.key));
  const [auditSummary, setAuditSummary] = useState({
    info: 0,
    low: 0,
    moderate: 0,
    high: 0,
    critical: 0,
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

    // 入力テキストを行ごとに分割し、各行をトリムして空行を除外
		const lines = inputText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
		const rows: string[] = [];
		for (const line of lines) {
			try {
        // 各行をJSON.parseしてオブジェクト化
				const parseLine = JSON.parse(line);

        // audit summaryセット
        if (parseLine.type === "auditSummary") {
          setAuditSummary({
            info: parseLine.data.vulnerabilities.info,
            low: parseLine.data.vulnerabilities.low,
            moderate: parseLine.data.vulnerabilities.moderate,
            high: parseLine.data.vulnerabilities.high,
            critical: parseLine.data.vulnerabilities.critical,
          });
          continue;
        } 

        if (parseLine.type === "auditAdvisory") {
          // 脆弱性情報のオブジェクト
          const advisory = parseLine.data.advisory;
          const row = headers.map((h) => escapeCsv(getAdvisoryValue(advisory, h))).join(",");
          rows.push(row);
        }
			} catch (e) {
				console.error(e);
			}
		}

		setCsvText(headers.join(",") + "\n" + rows.join("\n"));
	};

  // advisoryオブジェクトから指定されたキーの値を取得する
  const getAdvisoryValue = (advisory: any, key: string) => {
    switch (key) {
      case "module_name":
        return advisory.module_name;
      case "severity":
        return advisory.severity;
      case "version":
        return advisory.findings?.[0]?.version || "";
      case "vulnerable_versions":
        return advisory.vulnerable_versions;
      case "patched_versions":
        return advisory.patched_versions;
      case "title":
        return advisory.title;
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
    const sample = `{"type":"auditAdvisory","data":{"advisory":{"module_name":"example-package","severity":"high","vulnerable_versions":"<2.0.0","patched_versions":">=2.0.0","findings":[{"version":"1.5.0"}],"title":"Example vulnerability"}}}
{"type":"auditSummary","data":{"vulnerabilities":{"info":0,"low":0,"moderate":0,"high":1,"critical":0}}}`;
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
      <h2 className={styles.title}>Yarn Audit Viewer</h2>
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
            </div>
          </div>

          <div className={styles.editorRow}>
            <div className={styles.editorPane}>
              <div className={styles.fieldTitle}>yarn audit --json を貼り付け</div>
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