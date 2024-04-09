import Navbar from "./Navbar";
import { logo } from "../assets";

export default function Header() {
  return (
    <div className="sticky top-0 flex h-16 w-full items-center justify-center bg-green-950 bg-opacity-50 px-4 text-[#EDE9A3] backdrop-blur-xl lg:h-screen lg:w-64 lg:items-start lg:bg-opacity-100 lg:py-8">
      <div className="flex w-full items-center justify-between lg:flex-col lg:items-start lg:justify-start lg:gap-10">
        <a
          href="https://francisluy.github.io/Portfolio_LUY/"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src={logo}
            alt="logo"
            className="size-[40px] lg:size-[60px] lg:self-center"
          />
        </a>
        <h1 className="self-center text-2xl font-semibold">Portfolio CMS</h1>
        <Navbar />
      </div>
    </div>
  );
}
