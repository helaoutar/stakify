import React from "react";
import useCurrentUser from "../hooks/useCurrentUser";
import Controls from "./Controls";

const Root: React.FC = () => {
  const { userData, connectWallet } = useCurrentUser();

  return userData ? (
    <Controls currentUser={userData} />
  ) : (
    <div className="flex justify-end pt-8 pr-6">
      <button className="btn btn-blue" onClick={connectWallet}>
        Connect Wallet
      </button>
    </div>
  );
};

export default Root;
