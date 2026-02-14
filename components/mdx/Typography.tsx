import React from "react";

export function H1({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-3xl font-bold mt-12 mb-4 pb-2">
      {children}
    </h1>
  );
}

export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-bold mt-12 mb-4 pb-2">
      {children}
    </h2>
  );
}

export function P({ children }: { children: React.ReactNode }) {

  // 子要素にimgタグがあるかどうかをチェック
  const childArray = React.Children.toArray(children);
  const hasImage = childArray.length === 1 && React.isValidElement(childArray[0]) && childArray[0].type === Img

  return (
    <p className={`leading-8 my-4 ${hasImage ? "max-w-160" : ""}`}>
      {children}
    </p>
  );
}

export function A({
  href,
  children,
}: {
  href?: string;
  children: React.ReactNode;
}) {
  const isExternal = href?.startsWith("http");

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="text-blue-600 underline underline-offset-4 hover:opacity-70 transition"
    >
      {children}
    </a>
  );
}

export function Ul({ children }: { children: React.ReactNode }) {
  return (
    <ul className="list-disc ml-6 my-2 space-y-2">
      {children}
    </ul>
  );
}

export function Ol({ children }: { children: React.ReactNode }) {
  return (
    <ol className="list-decimal ml-6 my-4 space-y-2">
      {children}
    </ol>
  );
}

export function Li({ children }: { children: React.ReactNode }) {
  const childArray = React.Children.toArray(children)
  
  return (
    <li className="leading-5">
      {children}
    </li>
  );
}

export function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">
      {children}
    </code>
  );
}

export function Pre({ children }: { children: React.ReactNode }) {
  return (
    <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto my-6 text-sm">
      {children}
    </pre>
  );
}

export function Blockquote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="border-l-4 border-gray-950 pl-4 italic text-gray-600 my-6">
      {children}
    </blockquote>
  );
}

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto my-8">
      <table className="min-w-full border border-gray-950 text-sm">
        {children}
      </table>
    </div>
  );
}

export function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="border px-4 py-2 bg-gray-100 text-left">
      {children}
    </th>
  );
}

export function Td({ children }: { children: React.ReactNode }) {
  return (
    <td className="border px-4 py-2">
      {children}
    </td>
  );
}

export function Hr() {
  return <hr className="my-5 border-gray-950" />;
}

import Image from "next/image";

export function Img({
  src = "",
  alt = "",
}: {
  src?: string;
  alt?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={0}
      style={{ width: "100%", height: "auto" }}
      className="rounded-lg"
    />
  );
}
