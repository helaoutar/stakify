import React from "react";
import useCurrentUser from "../hooks/useCurrentUser";
import useWeb3 from "../hooks/useWeb3";
import Controls from "./Controls";

const Root: React.FC = () => {
  const { userData, connectWallet } = useCurrentUser();
  const { web3 } = useWeb3();

  return userData && web3 ? (
    <Controls currentUser={userData} web3={web3} />
  ) : (
    <div className="flex justify-end pt-8 pr-6">
      <button className="btn btn-blue" onClick={connectWallet}>
        Connect Wallet
      </button>
    </div>
  );
};

export default Root;
