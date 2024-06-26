import { useState } from "react";
import { MdMenu, MdClose } from "react-icons/md";
import { cn } from "../lib/utils";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";

const navItems = [
  {
    name: "Home",
    href: "#",
  },
  {
    name: "About",
    href: "#about",
  },
  {
    name: "Skills",
    href: "#skills",
  },
  {
    name: "Experiences",
    href: "#experiences",
  },
  {
    name: "Projects",
    href: "#projects",
  },
  {
    name: "Artworks",
    href: "#artworks",
  },

  {
    name: "Contact",
    href: "#contact",
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const logout = async () => {
    await signOut(auth);
  };

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="lg:w-full">
      <div className="hidden w-full gap-4 lg:flex lg:flex-col lg:items-start">
        {navItems.map((navItem) => (
          <a
            key={navItem.name}
            href={navItem.href}
            className="relative w-full whitespace-nowrap"
          >
            <div className="flex w-full items-center rounded-md px-6 py-2 outline-none hover:bg-green-50 hover:bg-opacity-20">
              {navItem.name}
            </div>
          </a>
        ))}
        <div className="w-full pt-32">
          <button
            className="flex w-full items-center justify-center gap-2 rounded-md bg-[#EDE9A3] px-4 py-2 font-semibold text-green-950"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>
      <button onClick={toggleNavbar} className="text-3xl lg:hidden">
        {isOpen ? <MdClose /> : <MdMenu />}
      </button>
      <div
        onClick={toggleNavbar}
        className={cn(
          "absolute right-0 top-0 z-[-1] flex w-full origin-top scale-y-0 flex-col items-center gap-4 rounded-b-xl bg-green-950 bg-opacity-95 px-10 pb-10 pt-16 transition ease-in-out lg:hidden",
          isOpen && "scale-y-100",
        )}
      >
        {navItems.map((navItem) => (
          <a
            key={navItem.name}
            href={navItem.href}
            className="relative whitespace-nowrap"
            onClick={toggleNavbar}
          >
            <div className="flex items-center rounded-md p-2 outline-none hover:bg-green-50 hover:bg-opacity-20">
              {navItem.name}
            </div>
          </a>
        ))}
        <div className="w-full pt-8">
          <button
            className="flex w-full items-center justify-center gap-2 rounded-md bg-[#EDE9A3] px-4 py-2 font-semibold text-green-950"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
