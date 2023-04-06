const { loadFixture, mine } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");
const { assert } = require("chai");

describe("PromptPayrollFactory", function() {
  async function deployFixture() {
    const [owner, account1] = await ethers.getSigners();

    const PromptPayrollFactory = await ethers.getContractFactory("PromptPayrollFactory");
    const promptPayrollFactory = await PromptPayrollFactory.deploy();

    return { owner, account1, promptPayrollFactory};
  }

  it("should deploy a PromptPayroll contract", async () => {
    const { promptPayrollFactory } = await loadFixture(deployFixture);

    await promptPayrollFactory.createNewContract("test");
    const contracts = await promptPayrollFactory.getDeployedContracts();

    assert.strictEqual(contracts.length, 1);
  });
  
  it("should set the contract deployer as the owner", async() => {
    const { promptPayrollFactory, account1 } = await loadFixture(deployFixture);

    const newFactory = await ethers.getContractAt("PromptPayrollFactory", promptPayrollFactory.address, account1);
    await newFactory.createNewContract("test");

    const contracts = await newFactory.getDeployedContracts();
    const deployedContract = await ethers.getContractAt("PromptPayroll", contracts[0]);

    assert.strictEqual(await deployedContract.owner(), await account1.address);
  });

  it("should set the company name", async() => {
    const { promptPayrollFactory } = await loadFixture(deployFixture);
    const companyName = "Blah blah blah";
    await promptPayrollFactory.createNewContract(companyName);

    const contracts = await promptPayrollFactory.getDeployedContracts();
    const deployedContract = await ethers.getContractAt("PromptPayroll", contracts[0]);

    assert.strictEqual(await deployedContract.companyName(), companyName);
  });
});

describe("PromptPayroll", function() {
  async function deployFixture() {
    const [employer, employee0, employee1] = await ethers.getSigners();

    const PromptPayrollFactory = await ethers.getContractFactory("PromptPayrollFactory");
    const promptPayrollFactory = await PromptPayrollFactory.deploy();

    await promptPayrollFactory.createNewContract("test");
    const contracts = await promptPayrollFactory.getDeployedContracts();
    const promptPayroll = await ethers.getContractAt("PromptPayroll", contracts[0]);
    
    return { employer, employee0, employee1, promptPayroll };
  }

  it("should only allow owner to call onlyOwner functions", async() => {
    const { employee0, promptPayroll } = await loadFixture(deployFixture);

    try {
      const employeeSignerContract = promptPayroll.connect(employee0);
      await employeeSignerContract.changeCompanyName("Employee attak");
      assert.fail();
    } catch (err) {
      assert(err);
    }
  });

  it("should change the Company name", async() => {
    const { promptPayroll } = await loadFixture(deployFixture);

    const newCompanyName = "test two";
    await promptPayroll.changeCompanyName(newCompanyName);

    assert.strictEqual(await promptPayroll.companyName(), newCompanyName);
  });

  it("should add an employee", async() => {
    const { promptPayroll, employee0 } = await loadFixture(deployFixture);

    await promptPayroll.addEmployee(employee0.address, 100);
    const employeeAddress = await promptPayroll.employeeAddresses(0);
    assert.strictEqual(employeeAddress, employee0.address);

    const employee = await promptPayroll.employees(employeeAddress);
    assert.strictEqual(Number(employee[0]), 0);
    assert.strictEqual(employee[1], true);
    assert.strictEqual(Number(employee[2]), 100);
    assert.strictEqual(Number(employee[3]), 0);
    assert.strictEqual(Number(employee[4]), 0); 
  });

  it("should deactivate employee", async() => {
    const { promptPayroll, employee0 } = await loadFixture(deployFixture);

    await promptPayroll.addEmployee(employee0.address, 100);
    await promptPayroll.deactivateEmployee(0);
    
    const employeeRecord = await promptPayroll.employees(employee0.address);
    assert.strictEqual(employeeRecord[1], false);
  });

  it("should return employeeId", async() => {
    const { promptPayroll, employee0 } = await loadFixture(deployFixture);
    
    await promptPayroll.addEmployee(employee0.address, 100);
    
    assert.strictEqual(await promptPayroll.getEmployeeId(employee0.address), 0);
  });

  it("should update an employee's salary", async() => {
    const { promptPayroll, employee0 } = await loadFixture(deployFixture);

    await promptPayroll.addEmployee(employee0.address, 0);
    await promptPayroll.updateSalary(0, 69);
    const employee = await promptPayroll.employees(employee0.address);
    assert.strictEqual(Number(employee[2]), 69);
  });

  it("should return total salaries", async() => {
    const { promptPayroll, employee0, employee1 } = await loadFixture(deployFixture);
    
    await promptPayroll.addEmployee(employee0.address, 6);
    await promptPayroll.addEmployee(employee1.address, 9);

    assert.strictEqual(await promptPayroll.totalSalaries(), 15);
  });

  it("should return total salaries of only active employees", async() => {
    const { promptPayroll, employee0, employee1 } = await loadFixture(deployFixture);
    
    await promptPayroll.addEmployee(employee0.address, 6);
    await promptPayroll.addEmployee(employee1.address, 9);
    await promptPayroll.deactivateEmployee(1);

    assert.strictEqual(await promptPayroll.totalSalaries(), 6);
  });

  it('should deposit salaries for employees and send unclaimed balances', async() => {
    const { promptPayroll, employee0, employee1 } = await loadFixture(deployFixture);

    const contractAddress = await promptPayroll.address;

    await promptPayroll.addEmployee(employee0.address, 20000);
    await promptPayroll.addEmployee(employee1.address, 30000);

    await promptPayroll.depositSalaries(30, { value: 50000});
    assert.strictEqual(Number(await ethers.provider.getBalance(contractAddress)), 50000);
    
    const beforeBalance0 = await ethers.provider.getBalance(employee0.address);
    const beforeBalance1 = await ethers.provider.getBalance(employee1.address);
   
    await mine(5);
    await promptPayroll.depositSalaries(30, { value: 50000});

    const afterBalance0 = await ethers.provider.getBalance(employee0.address);
    const afterBalance1 = await ethers.provider.getBalance(employee1.address);
    assert.strictEqual(Number(await ethers.provider.getBalance(contractAddress)), 50000);
    assert.isAbove(afterBalance0, beforeBalance0);
    assert.isAbove(afterBalance1, beforeBalance1);
  });

  it("should terminate an employee", async() => {
    const { promptPayroll, employer, employee0 } = await loadFixture(deployFixture);

    const contractAddress = await promptPayroll.address;

    await promptPayroll.addEmployee(employee0.address, 1000000000000000);
    await promptPayroll.depositSalaries(30, { value: 1000000000000000});
    
    const employeeBeforeBalance = await ethers.provider.getBalance(employee0.address);
    const contractBeforeBalance = await ethers.provider.getBalance(contractAddress);
    const employerBeforeBalance = await ethers.provider.getBalance(employer.address);

    await mine(500000);
    await promptPayroll.terminateEmployee(0);

    const employee = await promptPayroll.employees(employee0.address);
    assert.strictEqual(employee[1], false);
    
    const employeeAfterBalance = await ethers.provider.getBalance(employee0.address);
    const contractAfterBalance = await ethers.provider.getBalance(contractAddress);
    const employerAfterBalance = await ethers.provider.getBalance(employer.address);

    assert.isAbove(employeeAfterBalance, employeeBeforeBalance);
    assert.isBelow(contractAfterBalance, contractBeforeBalance);
    assert.isAbove(employerAfterBalance, employerBeforeBalance);
  });

  it("should return balance of an employee by address", async() => {
    
    const { promptPayroll, employee0 } = await loadFixture(deployFixture);

    await promptPayroll.addEmployee(employee0.address, 1000000000000000);
    await promptPayroll.depositSalaries(30, { value: 1000000000000000 });

    assert.strictEqual(await promptPayroll.viewBalanceByAddress(employee0.address), 1000000000000000);
  });

  it("should return balance of an employee by id", async() => {
    
    const { promptPayroll, employee0 } = await loadFixture(deployFixture);

    await promptPayroll.addEmployee(employee0.address, 1000000000000000);
    await promptPayroll.depositSalaries(30, { value: 1000000000000000 });

    assert.strictEqual(await promptPayroll.viewBalanceById(0), 1000000000000000);
  });

  it("should only allow an employee to use onlyEmployee functions", async() => {
    const { promptPayroll, employee0 } = await loadFixture(deployFixture);

    await promptPayroll.addEmployee(employee0.address, 1000000000000000);
    await promptPayroll.depositSalaries(30, { value: 1000000000000000 });

    mine(500000);
    try { 
      await promptPayroll.withdrawSalary();
      assert.fail();
    } catch (err) {
      assert(err);
    }
  });

  it("should reduce balance of employee after withdrawal", async() => {
    const { promptPayroll, employee0 } = await loadFixture(deployFixture);

    await promptPayroll.addEmployee(employee0.address, 1000000000000000);
    await promptPayroll.depositSalaries(30, { value: 1000000000000000 });

    const employeeBefore = await promptPayroll.employees(employee0.address);
    const balanceBefore = employeeBefore[3];
    
    mine(500000);
    const employeeConnected = promptPayroll.connect(employee0);
    await employeeConnected.withdrawSalary();
    const employeeAfter = await employeeConnected.employees(employee0.address);
    const balanceAfter = employeeAfter[3];

    assert.isBelow(balanceAfter, balanceBefore);
  });

  it("should transfer withdrawn salary to employee", async() => {
    const { promptPayroll, employee0 } = await loadFixture(deployFixture);

    await promptPayroll.addEmployee(employee0.address, 1000000000000000);
    await promptPayroll.depositSalaries(30, { value: 1000000000000000 });

    const beforeWithdrawal = await ethers.provider.getBalance(employee0.address);
    
    mine(500000);
    const employeeConnected = promptPayroll.connect(employee0);
    await employeeConnected.withdrawSalary();
    const afterWithdrawal = await ethers.provider.getBalance(employee0.address);
    assert.isAbove(afterWithdrawal, beforeWithdrawal);
  });
  
  it("should update employeeAddresses array when an employee changes address", async() => {
    const { promptPayroll, employee0, employee1 } = await loadFixture(deployFixture);

    await promptPayroll.addEmployee(employee0.address, 1000000000000000);
    
    const employeeConnected = promptPayroll.connect(employee0);
       
    await employeeConnected.changeAddress(employee1.address);

    assert.strictEqual(await employeeConnected.employeeAddresses(0), employee1.address);
  });

  it("should update copy employee particulars over to new address key", async() => {
    const { promptPayroll, employee0, employee1 } = await loadFixture(deployFixture);

    await promptPayroll.addEmployee(employee0.address, 1000000000000000);
    const mappingBefore = await promptPayroll.employees(employee0.address);
    
    const employeeConnected = promptPayroll.connect(employee0);
    await employeeConnected.changeAddress(employee1.address);
    const mappingAfter = await employeeConnected.employees(employee1.address);

    assert.strictEqual(mappingBefore[0], mappingAfter[0]);
    assert.strictEqual(mappingBefore[1], mappingAfter[1]);
    assert.strictEqual(mappingBefore[2], mappingAfter[2]);
    assert.strictEqual(mappingBefore[3], mappingAfter[3]);
    assert.strictEqual(mappingBefore[4], mappingAfter[4]);
  });

  it("should deactivate previous employee struct when an employee changes address", async() => {
    const { promptPayroll, employee0, employee1 } = await loadFixture(deployFixture);

    await promptPayroll.addEmployee(employee0.address, 1000000000000000);
    
    const employeeConnected = promptPayroll.connect(employee0);
    await employeeConnected.changeAddress(employee1.address);

    const previousMapping = await employeeConnected.employees(employee0.address);

    assert.strictEqual(previousMapping[1], false);
    assert.strictEqual(previousMapping[3], 0);
    assert.strictEqual(previousMapping[4], 0);
  });

  it("should pay all employee payments due when a company is closed", async() => {
    const { promptPayroll, employee0, employee1 } = await loadFixture(deployFixture);

    await promptPayroll.addEmployee(employee0.address, 1000000000000000);
    await promptPayroll.addEmployee(employee1.address, 500000000000000);
    await promptPayroll.depositSalaries(30, { value: 1500000000000000})
    const initial0Balance = await ethers.provider.getBalance(employee0.address);
    const initial1Balance = await ethers.provider.getBalance(employee1.address);

    mine(5000);
    await promptPayroll.closeCompany();
    const final0Balance = await ethers.provider.getBalance(employee0.address);
    const final1Balance = await ethers.provider.getBalance(employee1.address);

    assert.isAbove(final0Balance, initial0Balance);
    assert.isAbove(final1Balance, initial1Balance);
  });

  it("should return unspent salaries to the employer and empty the contract account when a company is closed", async() => {
    const { promptPayroll, employer, employee0, employee1 } = await loadFixture(deployFixture);

    await promptPayroll.addEmployee(employee0.address, 1000000000000000);
    await promptPayroll.addEmployee(employee1.address, 500000000000000);
    await promptPayroll.depositSalaries(30, { value: 1500000000000000})
    const initialEmployerBalance = await ethers.provider.getBalance(employer.address);

    mine(5000);
    await promptPayroll.closeCompany();
    const finalEmployerBalance = await ethers.provider.getBalance(employer.address);
    const contractBalance = await ethers.provider.getBalance(promptPayroll.address);

    assert.isAbove(finalEmployerBalance, initialEmployerBalance);
    assert.strictEqual(contractBalance, 0);
  });

  it("should change the company name when a company is closed", async() => {
    const { promptPayroll, employee0 } = await loadFixture(deployFixture);
    
    await promptPayroll.closeCompany();
  
    assert.strictEqual(await promptPayroll.companyName(), "This company has been closed.");
  });

  it("hould return true if an address is an employee", async() => {
    const { promptPayroll, employee0 } = await loadFixture(deployFixture);
    await promptPayroll.addEmployee(employee0.address, 100);

    assert.strictEqual(await promptPayroll.isEmployee(employee0.address), true);
  });
});

