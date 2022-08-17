import { ethers } from "ethers";
import ethLogo from "../public/ethLogo.png";
import daiLogo from "../public/dai-logo.png";
import usdcLogo from "../public/usdc-logo.png";
import LinkLogo from "../public/link-logo.png";

export const useRetrieveTokenData = (tokenAddress) => {
  const tokenData = {
    name: "",
     logo: "",
  };
  const checkSumAddress = ethers.utils.getAddress(tokenAddress);
  switch (checkSumAddress) {
    case "0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F":
      tokenData.name = "DAI";
      tokenData.logo = daiLogo;
      break;
    case "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889":
      tokenData.name = "WETH";
      tokenData.logo = ethLogo;
      break;
    case "0x8f7116CA03AEB48547d0E2EdD3Faa73bfB232538":
      tokenData.name = "USDC";
      tokenData.logo = usdcLogo;
      break;
    case "0x326C977E6efc84E512bB9C30f76E30c160eD06FB":
      tokenData.name = "Link";
      tokenData.logo = LinkLogo;
      break;
    default:
      break;
  }
  return tokenData;
};
