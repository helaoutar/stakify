import { ethers } from "ethers";
import Web3Modal from "web3modal";

export const getWeb3Modal = () => {
  const web3Modal = new Web3Modal({
    network: "rinkeby",
    cacheProvider: false,
    providerOptions: {},
  });

  return web3Modal;
};

const connectWallet = async () => {
  const web3Modal = getWeb3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const accounts = await provider.listAccounts();

  return {
    account: accounts[0],
    provider,
  };
};

export default connectWallet;
