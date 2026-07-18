import Image from "next/image";
import Link from "next/link";
import styles from "@/app/styles/components/header.module.scss";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <h1 className={styles.title}>
          <Link href="/" className={styles.link}>
            <span className="sr-only">r.blog</span>
            <Image
              src="/images/global/logo@4x.png"
              alt="r.blog"
              width={350}
              height={134}
              priority
              unoptimized
              aria-hidden="true"
              className={styles.logo}
            />
          </Link>
        </h1>
      </div>
    </header>
  );
}
