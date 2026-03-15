import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | r.blog",
  description: "",
};

export default function PrivacyPolicyPage() {
  return (
    <section className="text-[15px] leading-[25px] tracking-[-0.01em]">
      <header>
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
      </header>

      <article>
        <h2 className="text-2xl font-bold mt-[2em] mb-[0.4em]">アクセス解析ツールについて</h2>
        <p className="mb-4">このブログでは、サイトの利用状況を把握し改善するため、Googleによるアクセス解析ツール「Googleアナリティクス」を使用しています。Googleアナリティクスはトラフィックデータ収集のためCookieを使用しています。Cookieによって収集されるデータは匿名で個人を特定するものではありませんが、Cookieを無効にすることで収集を拒否することが可能です。お使いのブラウザの設定をご確認ください。</p>
        <p>この規約に関しての詳細は<Link href="https://policies.google.com/technologies/partner-sites?hl=ja" target="_blank" rel="noopener noreferrer" className="mx-1 text-(--color-primary-red) underline underline-offset-4 hover:opacity-70 transition">Googleのポリシーと規約</Link>をご覧ください。</p>
      </article>
    </section>
  );
}
