import About from "./About";
import Artworks from "./Artworks";
import Hero from "./Hero";
import Projects from "./Projects";
import Skills from "./Skills";

export default function MainContent() {
  return (
    <div className="h-full grow space-y-8 overflow-auto bg-gray-100">
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Artworks />
    </div>
  );
}
