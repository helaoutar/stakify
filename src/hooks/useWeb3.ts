import { useContext } from "react";
import { Web3Context } from "../context/Web3Provider";

const useWeb3 = () => {
  const { web3, setWeb3 } = useContext(Web3Context);

  return {
    web3,
    setWeb3,
  };
};

export default useWeb3;
