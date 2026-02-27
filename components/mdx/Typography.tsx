import React from "react";

export function H1({ children }: { children: React.ReactNode }) {
  return (
    <h1>{children}</h1>
  );
}

export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2>{children}</h2>
  );
}

export function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3>{children}</h3>
  );
}

export function H4({ children }: { children: React.ReactNode }) {
  return (
    <h4>{children}</h4>
 );
}

export function H5({ children }: { children: React.ReactNode }) {
  return (
    <h5>{children}</h5>
 );
}

export function P({ children }: { children: React.ReactNode }) {
  return (
    <p>{children}</p>
  );
}

// export function P({ children }: { children: React.ReactNode }) {
//   // 子要素にimgタグがあるかどうかをチェック
//   const childArray = React.Children.toArray(children);
//   const hasImage = childArray.length === 1 && React.isValidElement(childArray[0]) && childArray[0].type === Img;
//   const Tag = hasImage ? "figure" : "p";

//   return (
//     <p className={hasImage ? "img" : undefined}>{children}</p>
//   );
// }

export function A({href,children,}:{ href?: string; children: React.ReactNode; }) {
  const isExternal = href?.startsWith("http");
  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      // className=""
    >
      {children}
    </a>
  );
}

export function Ul({ children }: { children: React.ReactNode }) {
  return (
    <ul>{children}</ul>
  );
}

export function Ol({ children }: { children: React.ReactNode }) {
  return (
    <ol>{children}</ol>
  );
}

export function Li({ children }: { children: React.ReactNode }) {
  return (
    <li>{children}</li>
  );
}

export function Code({ children }: { children: React.ReactNode }) {
  return (
    <code>{children}</code>
  );
}

export function Pre({ children }: { children: React.ReactNode }) {
  return (
    <pre>{children}</pre>
  );
}

export function Blockquote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote>{children}</blockquote>
  );
}

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <table>
        {children}
      </table>
    </div>
  );
}

export function Th({ children }: { children: React.ReactNode }) {
  return (
    <th>{children}</th>
  );
}

export function Td({ children }: { children: React.ReactNode }) {
  return (
    <td>{children}</td>
  );
}

export function Hr() {
  return <hr />;
}

import Image from "next/image";
export function Img({ src = "", alt = "", }: { src?: string; alt?: string; }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={0}
      style={{ width: "100%", height: "auto" }}
    />
  );
}
