import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/app/styles/pages/privacy.module.scss";

export const metadata: Metadata = {
  title: "Privacy Policy | r.blog",
  description: "",
};

export default function PrivacyPolicyPage() {
  return (
    <article>
      <div className={styles.container}>
        <header>
          <h1 className={styles.title}>Privacy Policy</h1>
        </header>

        <section>
          <h2 className={styles.sectionTitle}>アクセス解析ツールについて</h2>
          <p className={styles.paragraph}>このブログでは、サイトの利用状況を把握し改善するため、Googleによるアクセス解析ツール「Googleアナリティクス」を使用しています。Googleアナリティクスはトラフィックデータ収集のためCookieを使用しています。Cookieによって収集されるデータは匿名で個人を特定するものではありませんが、Cookieを無効にすることで収集を拒否することが可能です。お使いのブラウザの設定をご確認ください。</p>
          <p>この規約に関しての詳細は<Link href="https://policies.google.com/technologies/partner-sites?hl=ja" target="_blank" rel="noopener noreferrer" className={styles.link}>Googleのポリシーと規約</Link>をご覧ください。</p>
        </section>
      </div>
    </article>
  );
}
