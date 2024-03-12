import Header from "./components/Header";
import MainContent from "./components/MainContent";

function App() {
  return (
    <div className="flex flex-col items-center lg:flex-row lg:items-start">
      <Header />
      <MainContent />
    </div>
  );
}

export default App;
