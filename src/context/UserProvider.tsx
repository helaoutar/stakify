import { ethers } from "ethers";
import { createContext, useState } from "react";
import Web3 from "web3";
import useWeb3 from "../hooks/useWeb3";
import connectWallet, { getWeb3Modal } from "../utils/connectWallet";

export type UserData = {
  address: string | undefined;
};

const noop = () => {};

const UserContext = createContext<{
  userData: UserData | null;
  requestAccount: () => void;
  disconnectWallet: () => void;
}>({
  userData: {
    address: "",
  },
  requestAccount: noop,
  disconnectWallet: noop,
});

const UserProvider: React.FC = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const { setWeb3 } = useWeb3();

  const requestAccount = async () => {
    const web3 = await connectWallet();

    const accounts = await web3.eth.getAccounts();

    setUserData({
      address: accounts[0],
    });
    setWeb3(web3);
  };

  const disconnectWallet = () => {
    const web3Modal = getWeb3Modal();

    web3Modal.clearCachedProvider();
    setUserData(null);
  };

  return (
    <UserContext.Provider
      value={{
        userData: userData,
        requestAccount,
        disconnectWallet,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext };

export default UserProvider;
