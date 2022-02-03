import { useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { UserContext } from "../context/UserProvider";

const useLogin = () => {
  const { userData, requestAccount } = useContext(UserContext);

  const connectWallet = () => {
    if (!userData?.address) {
      if (!window.ethereum) {
        toast.error("Please Install MetaMask");
      } else {
        requestAccount();
      }
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  return {
    userData,
    connectWallet,
  };
};

export default useLogin;
