import { useState } from "react";
import { NoWalletDashboard } from "./NoWalletDashboard";
import { TabButtonContainer } from "./TabButtonContainer";
import { WalletDashboard } from "./WalletDashboard";

export const TabSelector = ({ walletConnected, account }) => {
  const [selected, setSelected] = useState("Dashboard");

  const renderTab = () => {
    switch (selected) {
      default:
        return !walletConnected ? (
          <NoWalletDashboard />
        ) : (
            <WalletDashboard account={account} />
        );
    }
  };
  return (
    <>
      <TabButtonContainer getter={selected} setter={setSelected} />
      {renderTab()}
    </>
  );
};
