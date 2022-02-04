import { createContext, useState } from "react";
import Web3 from "web3";

export type UserData = {
  address: string | undefined;
};

const noop = () => {};

const Web3Context = createContext<{
  web3: Web3 | null;
  setWeb3: Function;
}>({
  web3: null,
  setWeb3: noop,
});

const Web3Provider: React.FC = ({ children }) => {
  const [web3, setWeb3] = useState<Web3 | null>(null);

  return (
    <Web3Context.Provider
      value={{
        web3,
        setWeb3,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export { Web3Context };

export default Web3Provider;
