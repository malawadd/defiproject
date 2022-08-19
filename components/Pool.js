import s from "../styles/Pool.module.scss";
import { useEffect, useState } from "react";
import Select from "react-select";
import { Button } from "./Button";
import ethLogo from "../public/ethLogo.png";
import daiLogo from "../public/dai-logo.png";
import uscLogo from "../public/usdc-logo.png";
import linkLogo from "../public/link-logo.png";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import { addDays, format } from "date-fns";
import { DateRange, DayPicker, useDayRender } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ethers } from "ethers";
import Taamin from "../abi/Taamin.json";
import ERC20 from "../abi/GenericErc20.json";
import Tooltip from "@mui/material/Tooltip";

const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);
const TaaminContractAddress = Taamin.address;

export const Pool = ({ account }) => {
  const [selectedToken, setSelectedToken] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [range, setRange] = useState();
  const [dateRangePicked, setDateRangePicked] = useState(false);
  const [fee, setFee] = useState(null);
  const [lossCover, setLossCover] = useState(null);
  const [amount, setAmount] = useState(null);
  const [buttonText, setButtonText] = useState(true);

  // Step 0: Creating contract instance for Taamin and ERC20
  const taaminContractInstance = new web3.eth.Contract(Taamin.abi, TaaminContractAddress);
  const erc20ContractInstance = new web3.eth.Contract(ERC20.abi, selectedToken?.contractAddress);

  const initAndSupplyInsurance = async () => {
    // Step 0: Find contract id
    const id = await taaminContractInstance.methods.id().call();
    console.log(selectedToken.contractAddress)
    console.log(selectedToken.priceFeed)
    console.log(lossCover)
    console.log(startDate)
    console.log(endDate)
    console.log(amount)
    console.log(ethers.utils.parseEther(amount))
    console.log(ethers.utils.parseEther(amount))
    console.log(id)
    //Step 1: Call function to init pool
    const initInsuranceTransactionParams = {
       
      from: account,
      to: TaaminContractAddress,
      data: taaminContractInstance.methods.initPool(
          selectedToken.contractAddress,
          selectedToken.priceFeed,
          lossCover,
          fee,
          startDate,
          endDate,
      
        ).encodeABI(),
        maxFeePerGas: 35000000000,
        maxPriorityFeePerGas: 35000000000,

        
    };
    
    //step 2 : Call the ERC20 contract to approve the transfer of tokens
    const approveTokenTransactionParams = {
      from: account,
      to: selectedToken.contractAddress,
      data: erc20ContractInstance.methods.approve(TaaminContractAddress, ethers.utils.parseEther(amount)).encodeABI(),
      maxFeePerGas: 35000000000,
        maxPriorityFeePerGas: 35000000000,
    };
    
    //step 3 : Call the Taamin contract to supply the insurance
    const supplyInsuranceTransactionParams = {
      from: account,
      to: TaaminContractAddress,
      data: taaminContractInstance.methods
      .supplyPool(id, ethers.utils.parseEther(amount))
      .encodeABI(),
      maxFeePerGas: 35000000000,
        maxPriorityFeePerGas: 35000000000,
    };

    try {
      setButtonText(false);
      await web3.eth.sendTransaction(initInsuranceTransactionParams);
      console.log("done init")
      await web3.eth.sendTransaction(approveTokenTransactionParams);
      console.log("done approve")
      await web3.eth.sendTransaction(supplyInsuranceTransactionParams);
      console.log("done supply")
      setButtonText(true);
      toast.success("You created a new Taamin pool", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } catch (err) {
      console.log("err: ", err);
    }
  };

  const tokens = [
    {
      value: "eth",
      label: "WETH",
      img: ethLogo,
      contractAddress: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
      priceFeed: "0x0715A7794a1dc8e42615F059dD6e406A6594651A",
    },
    {
      value: "dai",
      label: "DAI",
      img: daiLogo,
      contractAddress: "0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F",
      priceFeed: "0x0FCAa9c899EC5A91eBc3D5Dd869De833b06fB046",
    },
    {
      value: "usdc",
      label: "USDC",
      img: uscLogo,
      contractAddress: "0x8f7116CA03AEB48547d0E2EdD3Faa73bfB232538",
      priceFeed: "0x572dDec9087154dC5dfBB1546Bb62713147e0Ab0",
    },
    {
      value: "link",
      label: "Link",
      img: linkLogo,
      contractAddress: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
      priceFeed: "0x12162c3E810393dEC01362aBf156D7ecf6159528",
    },
  ];

  let footer = <p>Please pick the first day.</p>;
  if (range?.from) {
    if (!range.to) {
      footer = <p>{format(range.from, "PPP")}</p>;
    } else if (range.to) {
      footer = (
        <p>
          {format(range.from, "PPP")}–{format(range.to, "PPP")}
        </p>
      );
    }
  }

  // time variables to calculate the contract inputs in second differences

  const t0 = new Date();
  const t1 = new Date(range?.from);
  const t2 = new Date(range?.to);

  const startDate = ((t1.getTime() - t0.getTime()) / 1000).toFixed(0); //_startDateFromDeployInSeconds
  const endDate = ((t2.getTime() - t0.getTime()) / 1000).toFixed(0); //_endDateFromDeployInSeconds

  useEffect(() => {
    if (range && range.from && range.to) {
      setShowDatePicker(false);
      setDateRangePicked(true);
    }
  }, [range]);
  return (
    <div className={s.container}>
      <div className={s.wrapper}>
        <h3 className={s.tabHeader}>Create Taamin Pool</h3>
        <div className={s.row}>
          <p className={s.rowLabel}>Select Token</p>
          <div className={s.rowValue}>
            <Select
              theme={(theme) => ({
                ...theme,
                borderRadius: 8,
                colors: {
                  ...theme.colors,
                  primary25: "#d39d00",
                  primary: "#2b2c3b",
                  neutral0: "#c36e1b",
                  neutral80: "#d6edff",
                },
              })}
              defaultValue={selectedToken}
              onChange={setSelectedToken}
              options={tokens}
              formatOptionLabel={(token) => (
                <div className={s.selectOption}>
                  <Image src={token.img} width={30} height={30} alt="token-image" />
                  <span className={s.selectLabel}>{token.label}</span>
                </div>
              )}
              placeholder="Select token..."
            />
          </div>
        </div>
        <div className={s.row}>
          <Tooltip
            arrow
            placement="left"
            title="This represents the percentage of total value insured used for fee and it is used to calculate the user's premium insurance "
          >
            <p className={s.rowLabel}>Insurance fee %</p>
          </Tooltip>
          <div className={s.rowValue}>
            <input
              className={s.numInput}
              type="number"
              min={0}
              max={100}
              placeholder="0%-100%..."
              onChange={(e) => setFee(e.target.value)}
            />
          </div>
        </div>
        <div className={s.row}>
          <Tooltip arrow placement="left" title="This represents the percetage of price loss that the pool will cover. Beyond this percentage, the user will be reimbursed the loss cover amount">
            <p className={s.rowLabel}>Price Loss Cover %</p>
          </Tooltip>
          <div className={s.inputWithPreview}>
          <input
              className={s.numInput}
              type="number"
              min={0}
              max={100}
              placeholder="0%-100%..."
              onChange={(e) => setLossCover(e.target.value)}
            />
          </div>
        </div>
        <div className={s.row}>
        <Tooltip
            arrow
            placement="left"
            title="This represents the activity period of the insurance pool. Users will be able to receive their reimbursemnts during the activity period. It is however not possible both to supply new liquidity and request insurance during this period."
          >
            <p className={s.rowLabel}>Validity period</p>
          </Tooltip>
          <div className={s.rowValue}>
          {!dateRangePicked && !showDatePicker && (
              <Button
                buttonText="Select date"
                handleClick={() => setShowDatePicker(true)}
              />
            )}
            {showDatePicker && (
              <DayPicker
                mode="range"
                selected={range}
                footer={footer}
                onSelect={setRange}
                styles={{ day: { color: "#376d43" } }}
                modifiersClassNames={{
                  selected: s.selected,
                  day: s.cell,
                }}
              />
            )}
             {range && range.from && range.to && !showDatePicker && (
              <div className={s.dateSelectedContainer}>
                {" "}
                <p className={s.dateRange}>
                  {format(range.from, "PPP")} – {format(range.to, "PPP")}
                </p>
                <button
                  onClick={() => setShowDatePicker(true)}
                  className={s.openDateButton}
                >
                  edit
                </button>
              </div>
            )}
          </div>
        </div>
        <div className={s.poolSummary}>
        <h3 className={s.summaryHeading}>Supply Liquidity</h3>
        <div className={s.supplyContainer}>
        <p className={s.summaryLiquidity}>{selectedToken?.label ?? ""}</p>
        <input
        className={s.supplyInput}
        type="number"
        min={0}
        defaultValue={0}
        step={0.1}
        onChange={(e) => setAmount(e.target.value)}
        />
        </div>

        <Button
        handleClick={() => initAndSupplyInsurance()}
        className ={s.button}
        buttonText={buttonText ? "Create" : "Loading..."}
        />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
