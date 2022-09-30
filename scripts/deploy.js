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
  /// -------------- PayFactory Deploying... -------------------
  const Factory = await hre.ethers.getContractFactory("PayFactory");
  const factory = await Factory.deploy(process.env.FEE_SETTER_ADDRESS);

  await factory.deployed();
  await factory.deployTransaction.wait(3);

  console.log("PayFactory deployed address", factory.address);

  /// -------------- PayPair Deploying... -------------------
  const Pair = await hre.ethers.getContractFactory("PayPair");
  const pair = await Pair.deploy();

  await pair.deployed();
  await pair.deployTransaction.wait(3);

  console.log("PayPair deployed address", pair.address);

  /// -------------- PayERC20 Deploying... -------------------
  const Token = await hre.ethers.getContractFactory("PayERC20");
  const token = await Token.deploy();

  await token.deployed();
  await token.deployTransaction.wait(3);

  console.log("PayERC20 deployed address", token.address);

  console.log("------------------ verify PayFactory --------------------");
  await verifyFactory(factory.address);

  console.log("------------------ verify PayPair --------------------");
  await verify(pair.address);

  console.log("------------------ verify PayERC20 --------------------");

  await verify(token.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
