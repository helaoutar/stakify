import Web3 from "web3";
import { poolAddress, approveAddress } from "./../constants";

import abi from "../abi/pool";
import approveAbi from "../abi/test";

import { UserData } from "../context/UserProvider";

const getPoolContract = (web3: Web3) => {
  const poolContract = new web3.eth.Contract(
    // @ts-ignore
    abi,
    poolAddress
  );
  return poolContract;
};

const getApproveContract = (web3: Web3) => {
  const approveContract = new web3.eth.Contract(
    // @ts-ignore
    approveAbi,
    approveAddress
  );
  return approveContract;
};

const useStaking = (currentUser: UserData, web3: Web3) => {
  const wrapSendMethodeWithPromise = (method: any) => {
    return new Promise<any>((res, rej) => {
      method
        .send({ from: currentUser.address })
        .on("confirmation", res)
        .on("error", rej);
    });
  };

  const convertToWei = (amount: any) => {
    return web3.utils.toWei(amount, "ether");
  };

  const convertFromWei = (wei: any) => {
    return web3.utils.fromWei(wei.toString(), "ether");
  };

  const approveTransaction = (amount: any) => {
    const approveContract = getApproveContract(web3);
    return new Promise<any>((res, rej) => {
      approveContract.methods
        .approve(poolAddress, amount)
        .send({ from: currentUser.address })
        .on("confirmation", res)
        .on("error", rej);
    });
  };

  const stake = async (amount: number) => {
    const poolContract = getPoolContract(web3);

    const wei = convertToWei(amount.toString());
    await approveTransaction(wei);
    await wrapSendMethodeWithPromise(poolContract.methods.deposit(wei));
  };

  const unstake = async (amount: number) => {
    const poolContract = getPoolContract(web3);

    const wei = convertToWei(amount.toString());
    await approveTransaction(wei);
    await wrapSendMethodeWithPromise(poolContract.methods.withdraw(wei));
  };

  const claimRewards = async () => {
    const poolContract = getPoolContract(web3);

    await wrapSendMethodeWithPromise(poolContract.methods.claim());
  };

  const getTotalEarnedTokens = async () => {
    const poolContract = getPoolContract(web3);

    const data = await poolContract.methods
      .totalEarnedTokens(currentUser.address)
      .call();
    return convertFromWei(data);
  };

  const getDepositedToken = async () => {
    const poolContract = getPoolContract(web3);

    const data = await poolContract.methods
      .depositedTokens(currentUser.address)
      .call();
    return convertFromWei(data);
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
