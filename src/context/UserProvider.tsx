import { ethers } from "ethers";
import { createContext, useState } from "react";
import connectWallet, { getWeb3Modal } from "../utils/connectWallet";

export type UserData = {
  signature: ethers.providers.JsonRpcSigner | null;
  address: string | undefined;
};

const noop = () => {};

const UserContext = createContext<{
  userData: UserData | null;
  requestAccount: () => void;
  disconnectWallet: () => void;
}>({
  userData: {
    signature: null,
    address: "",
  },
  requestAccount: noop,
  disconnectWallet: noop,
});

const UserProvider: React.FC = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);

  const requestAccount = async () => {
    const { provider } = await connectWallet();

    const signer = provider.getSigner();
    const address = await signer.getAddress();

    setUserData({
      signature: signer,
      address: address,
    });
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
