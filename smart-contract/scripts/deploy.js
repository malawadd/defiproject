const hre = require("hardhat");
const fs = require("fs");
async function main() {
  const Taamin = await hre.ethers.getContractFactory("Taamin");
  const taamin = await Taamin.deploy();

  await taamin.deployed();

  console.log("taamin deployed to:", taamin.address);

  fs.writeFileSync(
    "././taamin.js", `
    export const taamin = "${taamin.address}"`
  )

}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//npx hardhat verify CONTRACT_ADDR --network mumbai
//npx hardhat verify 0xD24eD10c9b3313c853225D14f767b6dC53Be6b49 "0x1F98431c8aD98523631AE4a59f267346ea31F984" --network mumbai

//npx hardhat run --network mumbai scripts/deploy.js

//polygon scan : 0x4b48841d4b32C4650E4ABc117A03FE8B51f38F68

//0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512