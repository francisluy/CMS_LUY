import Header from "./components/Header";
import MainContent from "./components/MainContent";
import Login from "./components/Login";
import { auth } from "./config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function App() {
  const [user] = useAuthState(auth);
  return !user ? (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-r from-green-200 to-amber-50">
      <Login />
    </div>
  ) : (
    <div className="flex flex-col lg:flex-row">
      <Header />
      <MainContent />
    </div>
  );
}

export default App;
