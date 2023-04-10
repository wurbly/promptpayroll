const { ethers } = require("hardhat");

async function main() {
  const PromptPayrollFactory = await ethers.getContractFactory("PromptPayrollFactory");
  const promptPayrollFactory = await PromptPayrollFactory.deploy();

  await promptPayrollFactory.deployed();

  console.log("PromptPayrollFactory deployed to: ", promptPayrollFactory.address);
}

main()
  .catch(err => {
    console.error(err);
    process.exitCode = 1;
  });

// Deployed Factory Contract: 0x3910B7fC6D16FA3973c10ac8C6182980D5D26231