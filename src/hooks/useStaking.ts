import { poolAddress, approveAddress } from "./../constants/index";
import { ethers } from "ethers";
import abi from "../abi/pool";
import testabi from "../abi/test";
import { UserData } from "../context/UserProvider";
import Web3 from "web3";

const useStaking = (currentUser: UserData) => {
  const getContract = () => {
    const signer = currentUser.signature;
    const contract = new ethers.Contract(poolAddress, abi, signer!);

    return contract;
  };

  const getTestContract = () => {
    const signer = currentUser.signature;
    const contract = new ethers.Contract(poolAddress, testabi, signer!);

    return contract;
  };

  const stake = async (amount: number) => {
    const poolContract = getContract();
    const testContract = getTestContract();

    const numberOfDecimals = 0;
    const payload = "0x1"; //ethers.utils.parseUnits("1.0", numberOfDecimals);

    const web3 = new Web3(window.ethereum);

    // const approve = await testContract.approve(currentUser.address, payload, {
    //   gasLimit: 500000,
    // });
    // console.log(approve);
    // await approve.wait();
    console.log("test");
    const testToken = new web3.eth.Contract(
      // @ts-ignore
      testabi,
      approveAddress
    );

    const tokenStaking = new web3.eth.Contract(
      // @ts-ignore
      abi,
      poolAddress
    );

    // @ts-ignore
    let convertToWei = web3.utils.toWei("1", "Ether");

    testToken.methods
      .approve(poolAddress, convertToWei)
      .send({ from: currentUser.address })
      .on("transactionHash", (hash: any) => {
        tokenStaking.methods
          .stakeTokens(convertToWei)
          .send({ from: currentUser.address })
          .on("transactionHash", (hash: any) => {
            console.log("transactionHash");
          })
          .on("receipt", (receipt: any) => {
            console.log("transactionHash");
          })
          .on("confirmation", (confirmationNumber: any, receipt: any) => {
            console.log("transactionHash");
          });
      })
      .on("error", (error: any) => {
        console.log("Error Code:", error.code);
        console.log(error.message);
      });

    // const data = await poolContract.stakeTokens(payload, {
    //   gasLimit: 500000,
    // });
    // return data;
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
