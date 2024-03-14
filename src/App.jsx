import Header from "./components/Header";
import MainContent from "./components/MainContent";

function App() {
  return (
    <div className="flex flex-col lg:flex-row">
      <Header />
      <MainContent />
    </div>
  );
}

export default App;
