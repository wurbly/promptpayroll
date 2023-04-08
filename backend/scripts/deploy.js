const { ethers } = require("hardhat");

async function main() {
  const PromptPayrollFactory = await ethers.getContractFactory("PromptPayrollFactory");
  const promptPayrollFactory = await PromptPayrollFactory.deploy();

  console.log("PromptPayrollFactory deployed to: ", promptPayrollFactory.address);
}

main()
  .catch(err => {
    console.error(err);
    process.exitCode = 1;
  });