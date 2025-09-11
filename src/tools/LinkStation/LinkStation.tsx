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
            <h3>Prisma Client</h3>
            <div className={styles.subCategory}>
              <h4>CRUD</h4>
              <ul>
                <li><a href="https://www.prisma.io/docs/orm/prisma-client/queries/crud#create" target="_blank">create</a></li>
                <li><a href="https://www.prisma.io/docs/orm/prisma-client/queries/crud#create-multiple-records" target="_blank">createMany</a></li>
                <li><a href="https://www.prisma.io/docs/orm/prisma-client/queries/crud#get-record-by-id-or-unique-identifier" target="_blank">findUnique</a></li>
                <li><a href="https://www.prisma.io/docs/orm/prisma-client/queries/crud#get-all-records" target="_blank">findMany</a></li>
                <li><a href="https://www.prisma.io/docs/orm/prisma-client/queries/crud#update-a-single-record" target="_blank">update</a></li>
                <li><a href="https://www.prisma.io/docs/orm/prisma-client/queries/crud#update-multiple-records" target="_blank">updateMany</a></li>
                <li><a href="https://www.prisma.io/docs/orm/prisma-client/queries/crud#update-or-create-records" target="_blank">upsert</a></li>
                <li><a href="https://www.prisma.io/docs/orm/prisma-client/queries/crud#delete-a-single-record" target="_blank">delete</a></li>
                <li><a href="https://www.prisma.io/docs/orm/prisma-client/queries/crud#delete-multiple-records" target="_blank">deleteMany</a></li>
              </ul>
            </div>
            <div className={styles.subCategory}>
              <h4>Relation queries</h4>
                <ul>
                  <li><a href="https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#include-a-relation" target="_blank">include</a></li>
                  <li><a href="https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#select-specific-fields-of-included-relations" target="_blank">select</a></li>
                  <li><a href="https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#nested-writes" target="_blank">Nested writes</a></li>
                </ul>
            </div>
            <div className={styles.subCategory}>
              <h4>Relation filter</h4>
              <ul>
                <li><a href="https://www.prisma.io/docs/orm/reference/prisma-client-reference#some" target="_blank">some</a></li>
                <li><a href="https://www.prisma.io/docs/orm/reference/prisma-client-reference#none" target="_blank">none</a></li>
                <li><a href="https://www.prisma.io/docs/orm/reference/prisma-client-reference#is" target="_blank">is</a></li>
                <li><a href="https://www.prisma.io/docs/orm/reference/prisma-client-reference#isnot" target="_blank">isNot</a></li>
              </ul>
            </div>
          </section>

          <section className={styles.category}>
            <h3>Todo</h3>
            <ul>
              <li><a href="" target="_blank">Todo</a></li>
            </ul>
          </section>
        </div>

        {/* 右カラム（3割） */}
        <aside className={styles.rightColumn}>
          <div className={styles.sidebarBox}>
            <h3>便利ツール</h3>
            <ul>
              <li><a href="https://www-creators.com/tool/regex-checker" target="_blank">正規表現チェッカー</a></li>
              <li><a href="https://codic.jp/engine" target="_blank">codic</a></li>
              <li><a href="https://paiza.io/ja/projects/new" target="_blank">paiza.io</a></li>
            </ul>
          </div>

          <div className={styles.sidebarBox}>
            <h3>Todo</h3>
            <ul>
              <li><a href="" target="_blank">Todo</a></li>
            </ul>
          </div>

          <div className={styles.sidebarBox}>
            <h3>Todo</h3>
            <ul>
              <li><a href="" target="_blank">Todo</a></li>
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
