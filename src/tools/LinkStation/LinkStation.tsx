import styles from './LinkStation.module.css';
import LinkItem from './LinkItem';
import { links } from '../../config/links';

export type Link = {
  name: string;
  url: string;
};

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
            <h3>Prisma Client</h3>
            <div className={styles.subCategory}>
              <h4>CRUD</h4>
              <LinkItem link={links["Prisma Client"].CRUD} />
            </div>
            <div className={styles.subCategory}>
              <h4>Relation queries</h4>
              <LinkItem link={links["Prisma Client"]["Relation queries"]} />
            </div>
            <div className={styles.subCategory}>
              <h4>Relation filter</h4>
              <LinkItem link={links["Prisma Client"]["Relation filter"]} />
            </div>
          </section>

          <section className={styles.category}>
            <h3>React</h3>
            <div className={styles.subCategory}>
              <h4>Hooks</h4>
              <LinkItem link={links.React.Hooks} />
            </div>
            <div className={styles.subCategory}>
              <h4>Other</h4>
              <LinkItem link={links.React.Other} />
            </div>
          </section>
        </div>

        {/* 右カラム（3割） */}
        <aside className={styles.rightColumn}>
          <div className={styles.sidebarBox}>
            <h3>便利ツール</h3>
            <LinkItem link={links.便利ツール} />
          </div>

          <div className={styles.sidebarBox}>
            <h3>Todo</h3>
            <LinkItem link={links.Todo} />
          </div>

          <div className={styles.sidebarBox}>
            <h3>Todo</h3>
            <LinkItem link={links.Todo} />
          </div>
        </aside>
      </main>

      {/* フッター */}
      <footer className={styles.footer}>
        <p>© 2025 Sasa Tools</p>
      </footer>
    </div>
  );
}
