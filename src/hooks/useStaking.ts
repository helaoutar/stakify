import { useRef } from "react";
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

const useStaking = (currentUser: UserData) => {
  const web3 = useRef<Web3>(new Web3(window.ethereum));

  const wrapSendMethodeWithPromise = (method: any) => {
    return new Promise<any>((res, rej) => {
      method
        .send({ from: currentUser.address })
        .on("confirmation", res)
        .on("error", rej);
    });
  };

  const convertToWei = (amount: any) => {
    const wei = web3.current.utils.toWei(amount, "ether");

    return wei;
  };

  const approveTransaction = (amount: any) => {
    const approveContract = getApproveContract(web3.current);
    return new Promise<any>((res, rej) => {
      approveContract.methods
        .approve(poolAddress, amount)
        .send({ from: currentUser.address })
        .on("confirmation", res)
        .on("error", rej);
    });
  };

  const stake = async (amount: number) => {
    const poolContract = getPoolContract(web3.current);

    const wei = convertToWei(amount.toString());
    await approveTransaction(wei);
    await wrapSendMethodeWithPromise(poolContract.methods.stakeTokens(wei));
  };

  const unstake = async (amount: number) => {
    const poolContract = getPoolContract(web3.current);

    const wei = convertToWei(amount.toString());
    await approveTransaction(wei);
    await wrapSendMethodeWithPromise(poolContract.methods.unstakeTokens());
  };

  const claimRewards = async () => {
    const poolContract = getPoolContract(web3.current);

    await wrapSendMethodeWithPromise(poolContract.methods.claimRewards());
  };

  const getTotalEarnedTokens = async () => {
    const poolContract = getPoolContract(web3.current);

    const data = await poolContract.methods
      .stakingBalance(currentUser.address)
      .call();
    return web3.current.utils.fromWei(data.toString(), "ether");
  };

  const getDepositedToken = async () => {
    const poolContract = getPoolContract(web3.current);

    const data = await poolContract.methods
      .stakingBalance(currentUser.address)
      .call();
    return web3.current.utils.fromWei(data.toString(), "ether");
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
