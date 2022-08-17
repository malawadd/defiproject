import { useState } from "react";
import { NoWalletDashboard } from "./NoWalletDashboard";
import { TabButtonContainer } from "./TabButtonContainer";
import { WalletDashboard } from "./WalletDashboard";
import { Pool } from "./Pool";
import { Markets } from "./Markets";

export const TabSelector = ({ walletConnected, account }) => {
  const [selected, setSelected] = useState("Dashboard");

  const renderTab = () => {
    switch (selected) {
      case "Markets":
        return <Markets account={account} />;
      case "Pool":
        return <Pool account={account} />;
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
