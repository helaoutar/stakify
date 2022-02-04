import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import LoadingOverlay from "react-loading-overlay";
import BounceLoader from "react-spinners/BounceLoader";

import * as Yup from "yup";
import { useFormik, Form, FormikProvider, ErrorMessage } from "formik";
import { UserData } from "../../context/UserProvider";
import useStaking from "../../hooks/useStaking";
import Web3 from "web3";

type Props = {
  currentUser: UserData;
  web3: Web3;
};

const buttonClassName = `w-full mb-2 bg-transparent hover:bg-blue-500 text-blue-600 font-semibold hover:text-white py-2 px-4 border border-blue-400 hover:border-transparent rounded`;
const inputClassName = `border py-2 px-3 text-grey-darkest`;

const Controls: React.FC<Props> = ({ currentUser, web3 }) => {
  const {
    stake,
    unstake,
    claimRewards,
    getTotalEarnedTokens,
    getDepositedToken,
  } = useStaking(currentUser, web3);

  const [earnedTokens, setEarnedTokens] = useState("0.0");
  const [depositedTokens, setDepositedTokens] = useState("0.0");

  const stakeFormik = useFormik<{ stake: number }>({
    initialValues: {
      stake: 0,
    },
    validationSchema: Yup.object().shape({
      stake: Yup.number()
        .required("Value is required.")
        .min(1, "Minimum to stake is 1!"),
    }),
    onSubmit: async ({ stake: amount }) => {
      try {
        await stake(amount);
        getStats();
      } catch (e) {
        toast.error("Error while staking");
        console.log(e);
      }
    },
  });

  const unstakeFormik = useFormik<{ unstake: number }>({
    initialValues: {
      unstake: 0,
    },
    validationSchema: Yup.object().shape({
      unstake: Yup.number()
        .required("Value is required")
        .min(1, "Minimum to unstake is 1!"),
    }),
    onSubmit: async ({ unstake: amount }) => {
      try {
        await unstake(amount);
        getStats();
      } catch (e) {
        toast.error("Invalid amount to withdraw.");
        console.log(e);
      }
    },
  });

  const getStats = () => {
    getTotalEarnedTokens().then((data) => {
      setEarnedTokens(data);
    });

    getDepositedToken().then((data) => {
      setDepositedTokens(data);
    });
  };

  const handleClaim = async () => {
    if (earnedTokens === "0.0") {
      alert("Nothing to claim!");
    } else {
      await claimRewards();
      getStats();
    }
  };

  useEffect(() => {
    getStats();
  }, []);

  return (
    <>
      <LoadingOverlay
        active={stakeFormik.isSubmitting || unstakeFormik.isSubmitting}
        spinner={<BounceLoader />}
        className="w-full h-screen pt-32 flex justify-center"
      >
        <div className="flex flex-col border-2 py-4 px-6 rounded-md border-gray-100 h-min">
          <div className="text-xl font-semibold flex justify-between mb-8">
            <h2>Rewards: {earnedTokens}</h2>|
            <h2>Your Stake: {depositedTokens}</h2>
          </div>
          <div className="flex space-x-12">
            <FormikProvider value={stakeFormik}>
              <Form autoComplete="off" onSubmit={stakeFormik.handleSubmit}>
                <div className="flex flex-col items-start">
                  <button
                    className={buttonClassName}
                    type="submit"
                    disabled={stakeFormik.isSubmitting}
                  >
                    Stake
                  </button>
                  <input
                    type="number"
                    className={inputClassName}
                    {...stakeFormik.getFieldProps("stake")}
                  />
                  <ErrorMessage
                    className="mt-2 text-sm text-red-600"
                    name="stake"
                    component="span"
                  />
                </div>
              </Form>
            </FormikProvider>
            <FormikProvider value={unstakeFormik}>
              <Form autoComplete="off" onSubmit={unstakeFormik.handleSubmit}>
                <div className="flex flex-col items-start">
                  <button className={buttonClassName} type="submit">
                    Unstake
                  </button>
                  <input
                    type="number"
                    className={inputClassName}
                    {...unstakeFormik.getFieldProps("unstake")}
                  />
                  <ErrorMessage
                    className="mt-2 text-sm text-red-600"
                    component="span"
                    name="unstake"
                  />
                </div>
              </Form>
            </FormikProvider>
            <div className="flex flex-col items-start">
              <button className={buttonClassName} onClick={handleClaim}>
                Claim rewards
              </button>
            </div>
          </div>
        </div>
      </LoadingOverlay>
    </>
  );
};

export default Controls;
