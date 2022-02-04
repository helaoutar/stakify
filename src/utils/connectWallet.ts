import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";

export const getWeb3Modal = () => {
  const web3Modal = new Web3Modal({
    network: "rinkeby",
    cacheProvider: false,
    providerOptions: {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: "45101c3fe6c94e42bd92df51f2e8ebbc",
        },
      },
    },
  });

  return web3Modal;
};

const connectWallet = async () => {
  const web3Modal = getWeb3Modal();
  const connection = await web3Modal.connect();
  const web3 = new Web3(connection);
  return web3;
};

export default connectWallet;
