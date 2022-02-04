import { Toaster } from "react-hot-toast";
import Root from "./components/Root";
import UserProvider from "./context/UserProvider";
import Web3Provider from "./context/Web3Provider";

const App = () => {
  return (
    <div className="App">
      <Web3Provider>
        <UserProvider>
          <Toaster position="top-center" reverseOrder={false} />
          <Root />
        </UserProvider>
      </Web3Provider>
    </div>
  );
};

export default App;
