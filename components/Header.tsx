import Image from "next/image";

export default function Header() {
  return (
    <header className="max-w-230 mx-auto">
      <div className="absolute top-6.5 md:top-12 z-10 ml-2 md:ml-0.05">
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
            className="w-[220px] md:w-[350px] h-auto"
          />
        </h1>
      </div>
    </header>
  );
}