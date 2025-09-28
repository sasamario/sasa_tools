export const commandBuilder = {
  grep: {
    command: "grep",
    description: "指定したパターンを含む行を検索する",
    syntax: "grep [options] <pattern> [file...]",
    options: [
      { option: "i", description: "大文字と子文字を区別しない", type: "short" },
      { option: "n", description: "行番号を表示", type: "short" },
      { option: "l", description: "一致したファイル名のみ表示", type: "short" },
      { option: "c", description: "一致した行数だけを表示", type: "short" },
      { option: "r", description: "再帰的に検索", type: "short" },
      { option: "R", description: "シンボリックリンクもたどって再帰的に検索", type: "short" },
      // { option: "e", description: "検索パターンを指定", type: "short-arg" },
      // { option: "E", description: "拡張正規表現を使用", type: "short-arg" },
    ],
  },
  ls: {
    command: "ls",
    description: "ディレクトリやファイルの一覧を表示する",
    syntax: "ls [options]",
    options: [
      { option: "l", description: "詳細表示", type: "short" },
      { option: "h", description: "ファイルサイズを表示（-lと併用）", type: "short" },
      { option: "a", description: "隠しファイル（.で始まるファイル）も表示", type: "short" },
      { option: "A", description: "「.」と「..」を除く隠しファイルを表示", type: "short" },
      { option: "p", description: "ディレクトリの末尾に「/」をつける", type: "short" },
      { option: "F", description: "ファイルの種類ごとに識別記号をつける", type: "short" },
    ],
  }
}