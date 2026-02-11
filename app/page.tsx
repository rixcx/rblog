import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="">
      <main className="">
        <h1 className="text-4xl font-bold">
          r.blog
        </h1>
        <ul className="border-t border-(--text-primary) mt-4">
          <li>
            <Link href={`/pages`} className="block border-b border-(--text-primary) py-4">
              <h2>Title</h2>
              <data>2026.01.01</data>
            </Link>
          </li>
        </ul>
      </main>
    </div>
  );
}
