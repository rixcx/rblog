import Link from "next/link";
import styles from "@/app/styles/components/footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.corner}>
          <div className={styles.content}>
            <ul className={styles.links}>
              <li><Link href={`/privacy-policy`}>Privacy Policy</Link></li>
            </ul>
            <small className={styles.copy}>© 2026 r.blog</small>
          </div>
        </div>
      </div>
    </footer>
  );
}
