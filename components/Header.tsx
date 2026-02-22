import Image from "next/image";

export default function Header() {
  return (
    <header className="max-w-230 mx-auto">
      <div className="absolute top-12 z-10 mr-2">
        <h1 className="text-5xl font-bold mb-2">
          <span className="sr-only">r.blog</span>
          <Image
            src="/images/global/logo@4x.png"
            alt="r.blog"
            width={350}
            height={134}
            priority
            unoptimized
            aria-hidden="true"
          />
        </h1>
      </div>
    </header>
  );
}