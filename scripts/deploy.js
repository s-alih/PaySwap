// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const { verify, verifyFactory } = require("./utils/verify");
require("dotenv/config");

async function main() {
  /// -------------- PaytuskerFactory Deploying... -------------------
  const Factory = await hre.ethers.getContractFactory("PaytuskerFactory");
  const factory = await Factory.deploy(process.env.FEE_SETTER_ADDRESS);

  await factory.deployed();
  await factory.deployTransaction.wait(3);

  console.log("PaytuskerFactory deployed address", factory.address);

  /// -------------- PaytuskerPair Deploying... -------------------
  const Pair = await hre.ethers.getContractFactory("PaytuskerPair");
  const pair = await Pair.deploy();

  await pair.deployed();
  await pair.deployTransaction.wait(3);

  console.log("PaytuskerPair deployed address", pair.address);

  /// -------------- PaytuskerERC20 Deploying... -------------------
  const Token = await hre.ethers.getContractFactory("PaytuskerERC20");
  const token = await Token.deploy();

  await token.deployed();
  await token.deployTransaction.wait(3);

  console.log("PaytuskerERC20 deployed address", token.address);

  console.log(
    "------------------ verify PaytuskerFactory --------------------"
  );
  await verifyFactory(factory.address);

  console.log("------------------ verify PaytuskerPair --------------------");
  await verify(pair.address);

  console.log("------------------ verify PaytuskerERC20 --------------------");

  await verify(token.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
