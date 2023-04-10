"use client";

import { useState, useEffect } from "react";
import {
  Flex,
  Box,
  Heading,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { useAccount, useContractRead } from "wagmi";
import NameChange from "./components/NameChange";
import DepositSalary from "./components/DepositSalary";
import AddEmployee from "./components/AddEmployee";
import TerminateEmployee from "./components/TerminateEmployee";
import GetEmployeeId from "./components/GetEmployeeId";
import DeactivateEmployee from "./components/DeactivateEmployee";
import UpdateSalary from "./components/UpdateSalary";
import CloseCompany from "./components/CloseCompany";

export default function Employer({ params }) {
  const abi = [
    {
      inputs: [
        {
          internalType: "string",
          name: "newCompanyName",
          type: "string",
        },
        {
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "string",
          name: "companyName",
          type: "string",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "timeClosed",
          type: "uint256",
        },
      ],
      name: "CompanyClosed",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "string",
          name: "previousName",
          type: "string",
        },
        {
          indexed: true,
          internalType: "string",
          name: "newName",
          type: "string",
        },
      ],
      name: "CompanyNameChanged",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "string",
          name: "companyName",
          type: "string",
        },
        {
          indexed: true,
          internalType: "address",
          name: "companyOwner",
          type: "address",
        },
      ],
      name: "CompanyOpened",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "employeeId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "employeeAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "employeeSalary",
          type: "uint256",
        },
      ],
      name: "EmployeeAdded",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "employeeId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "previousAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newAddress",
          type: "address",
        },
      ],
      name: "EmployeeAddressChanged",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "employeeId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "employeeAddress",
          type: "address",
        },
      ],
      name: "EmployeeDeactivated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "employeeId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "dueSalaryPaid",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "unusedSalaryRefunded",
          type: "uint256",
        },
      ],
      name: "EmployeeTerminated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "totalDeposited",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "numberOfDays",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "monthStartTimestamp",
          type: "uint256",
        },
      ],
      name: "SalariesDeposited",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "employeeId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "previousSalary",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "newSalary",
          type: "uint256",
        },
      ],
      name: "SalaryUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "employeeId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "amountWithdrawn",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "timeWithdrawn",
          type: "uint256",
        },
      ],
      name: "SalaryWithdrawal",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "address payable",
          name: "employeeAddress",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "salary",
          type: "uint256",
        },
      ],
      name: "addEmployee",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address payable",
          name: "newAddress",
          type: "address",
        },
      ],
      name: "changeAddress",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "newCompanyName",
          type: "string",
        },
      ],
      name: "changeCompanyName",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "closeCompany",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "companyName",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "employeeId",
          type: "uint256",
        },
      ],
      name: "deactivateEmployee",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "daysInMonth",
          type: "uint256",
        },
      ],
      name: "depositSalaries",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "employeeAddresses",
      outputs: [
        {
          internalType: "address payable",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "employees",
      outputs: [
        {
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "isActive",
          type: "bool",
        },
        {
          internalType: "uint256",
          name: "salary",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "balance",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "lastWithdrawal",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getActiveEmployees",
      outputs: [
        {
          internalType: "address payable[]",
          name: "activeEmployees",
          type: "address[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "employeeAddress",
          type: "address",
        },
      ],
      name: "getEmployeeId",
      outputs: [
        {
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getEmployees",
      outputs: [
        {
          internalType: "address payable[]",
          name: "allEmployees",
          type: "address[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "employeeAddress",
          type: "address",
        },
      ],
      name: "isEmployee",
      outputs: [
        {
          internalType: "bool",
          name: "employee",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "monthDuration",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "monthStart",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "employeeId",
          type: "uint256",
        },
      ],
      name: "terminateEmployee",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "totalBalances",
      outputs: [
        {
          internalType: "uint256",
          name: "total",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSalaries",
      outputs: [
        {
          internalType: "uint256",
          name: "total",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "employeeId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "newSalary",
          type: "uint256",
        },
      ],
      name: "updateSalary",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "employeeAddress",
          type: "address",
        },
      ],
      name: "viewBalance",
      outputs: [
        {
          internalType: "uint256",
          name: "balance",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "withdrawSalary",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "employeeAddress",
          type: "address",
        },
      ],
      name: "withdrawableSalary",
      outputs: [
        {
          internalType: "uint256",
          name: "withdrawable",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];

  const contractAddress = params.contract;
  const [walletConnectStatus, setWalletConnectStatus] = useState("");
  const [companyName, setCompanyName] = useState("");
  const { address, isConnecting, isConnected, isDisconnected, status } =
    useAccount();

  const { data: companyNameData } = useContractRead({
    address: contractAddress,
    abi: abi,
    functionName: "companyName",
    watch: true,
  });

  useEffect(() => {
    if (isDisconnected) {
      setWalletConnectStatus(
        "Please connect wallet to deploy a Company Contract."
      );
    } else if (isConnecting) {
      setWalletConnectStatus("Awaiting connection");
    } else if (isConnected) {
      setWalletConnectStatus(`You are connected with ${address}.`);
    }
  }, [status]);

  useEffect(() => {
    if (companyNameData) {
      setCompanyName(companyNameData);
    }
  }, [companyNameData]);

  return (
    <Flex direction="column" align="center">
      <Box mb={3}>
        <Heading align="center" mb={3}>
          You are managing: {companyName}
        </Heading>
        <Text align="center" mb={3}>
          Contract address: {contractAddress}
        </Text>
        <Text align="center">
          Please ensure that you are on the correct company page.
        </Text>
        <Text align="center" mb={3}>
          If not, please head back to the directory to select the correct
          Company.
        </Text>
        <Text align="center">
          The transactions on this page can only be performed by the owner of
          the Company.
        </Text>
        <Text align="center" mb={3}>
          Transactions submitted by non-owners will fail and gas will be lost.
        </Text>
      </Box>
      <Box width="80%" bgColor="#0F4C75" align="center" p={3} mb={3}>
        <Text textAlign={"center"}>{walletConnectStatus}</Text>
      </Box>
      <Tabs width="80%" align="center" variant="enclosed">
        <TabList>
          <Tab>Deposit Salaries</Tab>
          <Tab>Change Company Name</Tab>
          <Tab>Add Employee</Tab>
          <Tab>Get Employee Id</Tab>
          <Tab>Update Employee Salary</Tab>
          <Tab>Deactivate Employee</Tab>
          <Tab>Terminate Employee</Tab>
          <Tab>Close Company</Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            <DepositSalary contractAddress={contractAddress} abi={abi} />
          </TabPanel>
          <TabPanel px={0}>
            <NameChange contractAddress={contractAddress} abi={abi} />
          </TabPanel>
          <TabPanel px={0}>
            <AddEmployee contractAddress={contractAddress} abi={abi} />
          </TabPanel>
          <TabPanel px={0}>
            <GetEmployeeId contractAddress={contractAddress} abi={abi} />
          </TabPanel>
          <TabPanel px={0}>
            <UpdateSalary contractAddress={contractAddress} abi={abi} />
          </TabPanel>
          <TabPanel px={0}>
            <DeactivateEmployee contractAddress={contractAddress} abi={abi} />
          </TabPanel>
          <TabPanel px={0}>
            <TerminateEmployee contractAddress={contractAddress} abi={abi} />
          </TabPanel>
          <TabPanel px={0}>
            <CloseCompany contractAddress={contractAddress} abi={abi} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
