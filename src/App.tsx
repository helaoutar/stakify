import { Toaster } from "react-hot-toast";
import Root from "./components/Root";
import UserProvider from "./context/UserProvider";

const App = () => {
  return (
    <div className="App">
      <Toaster position="top-center" reverseOrder={false} />
      <UserProvider>
        <Root />
      </UserProvider>
    </div>
  );
};

export default App;
