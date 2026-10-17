"use client";
import Link from "next/link";

let navlinks = [
  { name: "Photography", destination: "/home" },
  { name: "Films", destination: "/films" },
  { name: "Services", destination: "/services" },
  { name: "Contact Me", destination: "/contact-me" },
  { name: "About", destination: "/about" },
]

export default function Header() {
  return (
    <header>
      <nav className="flex justify-between px-8 h-18 bg-[#121212] items-center  border-[#575757]">
        <span>Filmy Stories</span>
        <section className="flex gap-4">
          {navlinks.map((link) => (
            <span><Link href={link.destination}>{link.name}</Link></span>

          ))}

        </section>
      </nav>
    </header>
  );
}
