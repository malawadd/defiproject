import { useState } from "react";
import { NoWalletDashboard } from "./NoWalletDashboard";
import { TabButtonContainer } from "./TabButtonContainer";

export const TabSelector = ({ walletConnected, account }) => {
  const [selected, setSelected] = useState("Dashboard");

  const renderTab = () => {
    switch (selected) {
      default:
        return !walletConnected ? (
          <NoWalletDashboard />
        ) : (
         <p> wallet </p>
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
