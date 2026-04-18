import styles from "./About.module.css";

export default function About() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>About this tool</h2>
      <section>
        <h3 className={styles.subTitle}>Tech Stack</h3>
        <ul>
          <li>Language: TypeScript</li>
          <li>Library: React</li>
          <li>UI Component: React95</li>
          <li>Build Tool: Vite</li>
        </ul>
      </section>
      <section>
        <h3 className={styles.subTitle}>Other</h3>
        <ul>
          <li>Service: Github Actions</li>
          <li>Deploy: Github Pages</li>
        </ul>
      </section>
    </div>
  );
}
