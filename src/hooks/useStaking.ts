import { poolAddress } from "./../constants/index";
import { ethers } from "ethers";
import abi from "../abi/pool";
import { UserData } from "../context/UserProvider";

const useStaking = (currentUser: UserData) => {
  const getContract = () => {
    const signer = currentUser.signature;
    const contract = new ethers.Contract(poolAddress, abi, signer!);

    return contract;
  };

  const stake = async (amount: number) => {
    const contract = getContract();

    const data = await contract.deposit(amount);
    return data;
  };

  const unstake = async (amount: number) => {
    const contract = getContract();

    const data = await contract.withdraw(amount);
    return data;
  };

  const claimRewards = async () => {
    const contract = getContract();

    const data = await contract.claim();
    return data;
  };

  const getTotalEarnedTokens = async () => {
    const contract = getContract();

    const data = await contract.totalEarnedTokens(currentUser.address);
    return ethers.utils.formatEther(data);
  };

  const getDepositedToken = async () => {
    const contract = getContract();

    const data = await contract.depositedTokens(currentUser.address);
    return ethers.utils.formatEther(data);
  };

  return {
    stake,
    unstake,
    claimRewards,
    getTotalEarnedTokens,
    getDepositedToken,
  };
};

export default useStaking;
