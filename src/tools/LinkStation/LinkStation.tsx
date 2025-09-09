import styles from './LinkStation.module.css';

export default function LinkStation() {
  return (
    <div className={styles.container}>
      {/* ヘッダー */}
      <header className={styles.header}>
        <h1 className={styles.logo}>LinkStation</h1>
      </header>

      {/* メイン（2カラム構成） */}
      <main className={styles.main}>
        {/* 左カラム（6割） */}
        <div className={styles.leftColumn}>
          <section className={styles.category}>
            <h3>公式ドキュメント</h3>
            <ul>
              <li><a href="https://www.prisma.io/docs/orm/prisma-client/queries" target="_blank">Prisma</a></li>
              <li><a href="" target="_blank">Todo</a></li>
              <li><a href="" target="_blank">Todo</a></li>
              <li><a href="" target="_blank">Todo</a></li>
              <li><a href="" target="_blank">Todo</a></li>
            </ul>
          </section>

          <section className={styles.category}>
            <h3>Todo</h3>
            <ul>
              <li><a href="https://github.com/" target="_blank">GitHub</a></li>
            </ul>
          </section>
        </div>

        {/* 右カラム（3割） */}
        <aside className={styles.rightColumn}>
          <div className={styles.sidebarBox}>
            <h3>OSS貢献</h3>
            <ul>
              <li><a href="https://github.com/thorsten/phpMyFAQ" target="_blank">phpMyFAQ</a></li>
            </ul>
          </div>

          <div className={styles.sidebarBox}>
            <h3>制作物</h3>
            <ul>
              <li><a href="https://sasamario.github.io/sasa_tools/" target="_blank">業務効率化ツール</a></li>
              <li><a href="https://github.com/sasamario/sasatora" target="_blank">自動チャイム叩き機</a></li>
              <li><a href="https://github.com/sasamario/chrome_memo" target="_blank">メモ（Chrome拡張）</a></li>
              <li><a href="https://github.com/sasamario/CheatingDice" target="_blank">サイコロアプリ</a></li>
            </ul>
          </div>

          <div className={styles.sidebarBox}>
            <h3>所持資格</h3>
            <ul>
              <li><a href="https://www.ipa.go.jp/shiken/kubun/ap.html" target="_blank">応用情報技術者</a></li>
              <li><a href="https://www.ipa.go.jp/shiken/kubun/fe.html" target="_blank">基本情報技術者</a></li>
            </ul>
          </div>
        </aside>
      </main>

      {/* フッター */}
      <footer className={styles.footer}>
        <p>© 2025 LinkStation</p>
      </footer>
    </div>
  );
}
