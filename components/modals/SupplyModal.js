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

export const SupplyModal = ({ item, pool, show, onClose, account }) => {
    const [isBrowser, setIsBrowser] = useState(false);
    const [amount, setAmount] = useState(0);
    const [buttonText, setButtonText] = useState(true);

  const taaminContractInstance = new web3.eth.Contract(Taamin.abi, TaaminContractAddress);
  const erc20ContractInstance = new web3.eth.Contract(ERC20.abi, pool?.tokenAddress);

  const supplyInsurance = async () => {
    const approveTokenTransactionParams = {
        from: account,
        to: pool?.tokenAddress,
        data: erc20ContractInstance.methods
        .approve(TaaminContractAddress, ethers.utils.parseEther(amount))
        .encodeABI(),
        maxFeePerGas: 35000000000,
        maxPriorityFeePerGas: 35000000000,
    }


    const supplyInsuranceTransactionParams = {
        from: account,
        to: TaaminContractAddress,
        data: taaminContractInstance.methods
        .supplyPool(pool.poolId, ethers.utils.parseEther(amount))
        .encodeABI(),
        maxFeePerGas: 35000000000,
        maxPriorityFeePerGas: 35000000000,
    }

    try {
        setButtonText(false);
        await web3.eth.sendTransaction(approveTokenTransactionParams);
        console.log("done");
        await web3.eth.sendTransaction(supplyInsuranceTransactionParams);
        setButtonText(true);
      } catch (err) {
        console.log("err: ", err);
      }
  }

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const modalContent = show ? (
    <div className={s.modalOverlay}>
      <div className={s.modal}>
        <h3 className={s.modalTitle}>
          How much are you supplying to the pool?
        </h3>

        <div className={s.priceRow}>
          <p className={s.priceLabel}>{item.name}: </p>
          <input
            className={s.priceValue}
            type="number"
            placeholder="0"
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className={s.buttonContainer}>
          <button className={s.modalButton} onClick={supplyInsurance}>
            {buttonText ? `Supply` : `Loading...`}
          </button>
          <button className={s.modalButton} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  ) : null;

  if (isBrowser) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById("supply-modal")
    );
  } else {
    return null;
  }
};
