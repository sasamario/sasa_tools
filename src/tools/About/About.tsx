import styles from "./About.module.css";

export default function About() {
  return (
    <div className={styles.container}>
      <h2>About this tool</h2>
      <section>
        <h3>Tech Stack</h3>
        <ul>
          <li>Language: React(v19)</li>
          <li>UI Component: React95</li>
          <li>Build Tool: Vite</li>
        </ul>
      </section>
      <section>
        <h3>Other</h3>
        <ul>
          <li>Service: Github Actions</li>
          <li>Deploy: Github Pages</li>
        </ul>
      </section>
    </div>
  );
}
