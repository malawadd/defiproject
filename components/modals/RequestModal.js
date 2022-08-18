import { useEffect, useState } from "react";
import { ethers } from "ethers";
import ReactDOM from "react-dom";
import s from "../../styles/MarketsModal.module.scss";
import Taamin from "../../abi/Taamin.json";
import ERC20 from "../../abi/GenericErc20.json";

const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);
const TaaminContractAddress = Taamin.address;

export const RequestModal = ({ item, pool, show, onClose, account }) => {
  const [isBrowser, setIsBrowser] = useState(false);
  const [amount, setAmount] = useState(0);
  const [fee, setFee] = useState(0);
  const [buttonText, setButtonText] = useState(true);

  const taaminContractInstance = new web3.eth.Contract(Taamin.abi, TaaminContractAddress);
  const erc20ContractInstance = new web3.eth.Contract(ERC20.abi, pool?.tokenAddress);

  const requestTaamin = async () => {
    // Step 1: Call the ERC20 contract to approve the transfer of tokens
    const approveTokenTransactionParams = {
      from: account,
      to: pool?.tokenAddress,
      data: erc20ContractInstance.methods.approve(TaaminContractAddress, ethers.utils.parseEther(amount)).encodeABI(),
      maxFeePerGas: 35000000000,
        maxPriorityFeePerGas: 35000000000,
    };

    const transactionParams = {
      from: account,
      to: TaaminContractAddress,
      data: taaminContractInstance.methods.requestInsurance(pool.poolId, ethers.utils.parseEther(amount)).encodeABI(),
    };

    try {
      setButtonText(false);
      await web3.eth.sendTransaction(approveTokenTransactionParams);
      await web3.eth.sendTransaction(transactionParams);
      setButtonText(true);
    } catch (err) {
      console.log(err);
    }
  };

  const getFee = async () => {
    try {
      const fee = await taaminContractInstance.methods.getUserFee(pool?.poolId, ethers.utils.parseEther(amount)).call();
      if (fee) {
        setFee(fee);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  useEffect(() => {
    if (amount > 0 && pool) {
      getFee();
    }
  }, [amount]);

  useEffect(() => {
    setFee(0);
  }, [pool]);

  const modalContent = show ? (
    <div className={s.modalOverlay}>
      <div className={s.modal}>
        <h3 className={s.modalTitle}>How much are you requesting to Taamin?</h3>
        <div className={s.modalBody}>
          <p className={s.priceLabel}>{item.name}: </p>
          <input className={s.priceValue} type="number" placeholder="0" onChange={(e) => setAmount(e.target.value)} />
        </div>
        <p>
          [Preview Taamin Fee: {fee ? ethers.utils.formatEther(fee) : "na"} {item.name}]
        </p>
        <div className={s.buttonContainer}>
          <button className={s.modalButton} onClick={requestTaamin}>
            {buttonText ? `Request` : `Loading...`}
          </button>
          <button className={s.modalButton} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  ) : null;
  if (isBrowser) {
    return ReactDOM.createPortal(modalContent, document.getElementById("supply-modal"));
  } else {
    return null;
  }
};
