import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative max-w-230 mx-auto">
      <div className="absolute w-full bottom-0 right-0 z-10 flex items-right justify-end">
        <div className="footer-corner">
          <div className="bg-primary-red text-primary-white text-sm h-10 px-4 pl-6 flex items-center rounded-tl-[20px]">
            <ul className="relative text-[0.75rem] flex justify-end gap-4 mr-3 pr-3 font-playfair after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[50%] after:w-px after:bg-primary-white">
              <li><Link href={`/privacy-policy`}>Privacy Policy</Link></li>
            </ul>
            <small className="font-playfair text-[0.75rem]">© 2026 r.blog</small>
          </div>
        </div>
      </div>
    </footer>
  );
}