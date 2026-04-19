export const commandBuilder = {
  grep: {
    command: "grep",
    description: "指定したパターンを含む行を検索する",
    syntax: "grep [options] <pattern> [file]",
    options: [
      { option: "i", description: "大文字と子文字を区別しない", type: "short" },
      { option: "E", description: "拡張正規表現を使用", type: "short" },
      { option: "l", description: "一致したファイル名のみ表示", type: "short" },
      { option: "c", description: "一致するものが含まれる行数を表示", type: "short" },
      { option: "r", description: "再帰的に検索", type: "short" },
      { option: "R", description: "シンボリックリンクもたどって再帰的に検索", type: "short" },
      { option: "h", description: "ファイル名を表示しない", type: "short" },
      { option: "H", description: "ファイル名を表示する", type: "short" },
      { option: "o", description: "一致した部分のみを表示", type: "short" },
      { option: "n", description: "行番号を表示", type: "short" },
      { option: "v", description: "パターンに一致しない行を表示", type: "short" },
    ],
    memo: "",
  },
  find: {
    command: "find",
    description: "ファイルやディレクトリを検索する",
    syntax: "find [path] [options]",
    options: [
      { option: "empty", description: "空のファイルやディレクトリを検索", type: "short" },
      { option: "type <type>", description: "指定したタイプのファイルを検索（f=通常のファイル、d=ディレクトリなど）", type: "long" },
      { option: "name <pattern>", description: "名前がパターンに一致するファイル（ディレクトリ）を検索", type: "long" },
      { option: "iname <pattern>", description: "nameオプションの大文字と小文字を区別しない版", type: "long" },
      { option: "printf <format>", description: "検索結果の出力形式を指定（例：%pはファイルのパス）", type: "long" },
      { option: "size <size>", description: "指定したサイズのファイルを検索（例：+100Mは100MBより大きいファイル）", type: "long" },
      { option: "mtime <days>", description: "指定した日数以内に変更されたファイルを検索（例：-7は7日以内に変更されたファイル）", type: "long" },
    ],
    memo: "■条件の組み合わせ\n"
      + "-a(-and) AND条件（省略可）\n"
      + "-o(-or): OR条件（指定条件によってはカッコで区切ること）\n"
      + "! (-not): NOT条件\n"
      + "\n"
      + "■printfのパターン\n"
      + "%p ファイルのフルパス\n"
      + "%f ファイル名\n"
      + "%t ファイルのタイプ\n"
      + "%s ファイルサイズ（バイト）\n"
      + "%TY-%Tm-%Td %TH:%TM:%TS 最終更新日時（例：2024-01-01 12:00:00）\n"
      + "\\n 改行",
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
    memo: "",
  }
}