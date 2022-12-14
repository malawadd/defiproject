import s from "../styles/WalletDashboard.module.scss";
import { useState } from "react";
import Image from "next/image";
import { DashboardDetailsModal } from "./modals/DashboardDetailsModal";
import { ToastContainer, toast } from "react-toastify";
import { gql, useQuery } from "@apollo/client";
import { useRetrieveTokenData } from "../hooks/useRetrieveTokenData";
import Taamin from "../abi/Taamin.json";


const GET_PROFILE_POOLS = gql`
  query ($insuranceRequester: Bytes!) {
    insuranceRequestEntities(
      where: { insuranceRequester: $insuranceRequester }
    ) {
      createdAtTimestamp
      poolId
      tokenAddress
      feeAmount
      insuranceLiquidityRequest
    }
  }
`;

const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;
const {createAlchemyWeb3} = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(alchemyKey)
const taaminContractAddress = Taamin.address
const taaminContractInstance = new web3.eth.Contract(Taamin.abi, taaminContractAddress)

export const WalletDashboard = ({ account }) => {
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState();
    const [tokenData, setTokenData] = useState();

    const handleModalOpening = (data, token)=> {
        setModalData(data);
        setTokenData(token);
        setShowModal(true);
    };

    // Query the list of created pools from the subgraph
    const {
        loading: poolsLoading,
        error: poolsError,
        data: poolsData
    } = useQuery(GET_PROFILE_POOLS, {
        variables: {
            insuranceRequester: account
        }
    });

    const pools = poolsData?.insuranceRequestEntities;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const retrieveTokenData = (tokenAddress) => useRetrieveTokenData(tokenAddress);

    const reimburse = async (poolId) => {
        const transactionParams = {
            // Hardcoded address for testing
            from: account,
            to: taaminContractAddress,
            data: taaminContractInstance.methods
              .requestReimbursement(poolId)
              .encodeABI(),
        };

        try {
            await web3.eth.sendTransaction(transactionParams);
            //Do reimburse stuff
            toast.success("You received your reimbursement!", {
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

    return(
        <div className={s.container}>
            <h3 className={s.tabHeader}>Your positions</h3>
            <div>
                <div className={s.tableRow}>
                <p className={s.tableHeadAsset}>Asset</p>
                <p className={s.tableHead}>Insurance Request</p>
                <p className={s.tableHead}>Fee Amount</p>
                </div>
            </div>
            {poolsLoading && <div>...loading</div>}
            <div className={s.dataContainer}>
            {pools?.map((item, index) => (
                 <div key={index}>
                     <div className={s.tableRow}>
                        <div className={s.dataAsset}>
                            
                            <Image
                            src={retrieveTokenData(item.tokenAddress).logo}
                            width={30}
                            height={30}
                            />
                        </div>
                        <p className={s.data}>
                            {item.insuranceLiquidityRequest / 10 ** 18}{" "}
                            {retrieveTokenData(item.tokenAddress).name}
                        </p>
                        <p className={s.data}>
                        {item.feeAmount / 10 ** 18}{" "}
                        {retrieveTokenData(item.tokenAddress).name}
                        </p>
                        <div className={s.data}>
                            <button
                             onClick={() => reimburse(item.poolId)}
                             className={s.dataButton}>
                            Reimburse
                            </button>
                        </div>
                        <div className={s.data}>
                            <button
                                onClick={() => 
                                    handleModalOpening(
                                        item, retrieveTokenData(item.tokenAddress)
                                        )
                                    }
                                className={s.dataButton}
                            >
                                Details
                            </button>
                        </div>
                     </div>
                 </div>
            ))}
            </div>
            <ToastContainer />
            <DashboardDetailsModal
                onClose={() => setShowModal(false)}
                show={showModal}
                item={modalData}
                token={tokenData}
            />
        </div>

    )    
}

