import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Box,
  Text,
  Flex,
  Button,
  Link,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { ethers } from "ethers";
import { useContractRead } from "wagmi";

export default function ContractCard({ address }) {
  const abi = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "newCompanyName",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "string",
          "name": "companyName",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "timeClosed",
          "type": "uint256"
        }
      ],
      "name": "CompanyClosed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "string",
          "name": "previousName",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "string",
          "name": "newName",
          "type": "string"
        }
      ],
      "name": "CompanyNameChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "string",
          "name": "companyName",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "companyOwner",
          "type": "address"
        }
      ],
      "name": "CompanyOpened",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "employeeId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "employeeAddress",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "employeeSalary",
          "type": "uint256"
        }
      ],
      "name": "EmployeeAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "employeeId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousAddress",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newAddress",
          "type": "address"
        }
      ],
      "name": "EmployeeAddressChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "employeeId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "employeeAddress",
          "type": "address"
        }
      ],
      "name": "EmployeeDeactivated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "employeeId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "dueSalaryPaid",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "unusedSalaryRefunded",
          "type": "uint256"
        }
      ],
      "name": "EmployeeTerminated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "totalDeposited",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "numberOfDays",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "monthStartTimestamp",
          "type": "uint256"
        }
      ],
      "name": "SalariesDeposited",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "employeeId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "previousSalary",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "newSalary",
          "type": "uint256"
        }
      ],
      "name": "SalaryUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "employeeId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "amountWithdrawn",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "timeWithdrawn",
          "type": "uint256"
        }
      ],
      "name": "SalaryWithdrawal",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address payable",
          "name": "employeeAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "salary",
          "type": "uint256"
        }
      ],
      "name": "addEmployee",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address payable",
          "name": "newAddress",
          "type": "address"
        }
      ],
      "name": "changeAddress",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "newCompanyName",
          "type": "string"
        }
      ],
      "name": "changeCompanyName",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "closeCompany",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "companyName",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "employeeId",
          "type": "uint256"
        }
      ],
      "name": "deactivateEmployee",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "daysInMonth",
          "type": "uint256"
        }
      ],
      "name": "depositSalaries",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "employeeAddresses",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "employees",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isActive",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "salary",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "balance",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "lastWithdrawal",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getActiveEmployees",
      "outputs": [
        {
          "internalType": "address payable[]",
          "name": "activeEmployees",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "employeeAddress",
          "type": "address"
        }
      ],
      "name": "getEmployeeId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getEmployees",
      "outputs": [
        {
          "internalType": "address payable[]",
          "name": "allEmployees",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "employeeAddress",
          "type": "address"
        }
      ],
      "name": "isEmployee",
      "outputs": [
        {
          "internalType": "bool",
          "name": "employee",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "monthDuration",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "monthStart",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "employeeId",
          "type": "uint256"
        }
      ],
      "name": "terminateEmployee",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalBalances",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "total",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSalaries",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "total",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "employeeId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "newSalary",
          "type": "uint256"
        }
      ],
      "name": "updateSalary",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "employeeAddress",
          "type": "address"
        }
      ],
      "name": "viewBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "balance",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "withdrawSalary",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "employeeAddress",
          "type": "address"
        }
      ],
      "name": "withdrawableSalary",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "withdrawable",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  const [companyName, setCompanyName] = useState("");
  const [totalPayrolls, setTotalPayrolls] = useState("");
  const [totalActive, setTotalActive] = useState("");
  const [owner, setOwner] = useState("");

  const { data: companyNameData } = useContractRead({
    address,
    abi: abi,
    functionName: "companyName",
    watch: true,
  });

  const { data: totalActiveEmployees } = useContractRead({
    address,
    abi: abi,
    functionName: "getActiveEmployees",
    watch: true,
  });

  const { data: totalPayrollData } = useContractRead({
    address,
    abi: abi,
    functionName: "totalSalaries",
    watch: true,
  });

  const { data: ownerData } = useContractRead({
    address,
    abi: abi,
    functionName: "owner",
    watch: true,
  });

  useEffect(() => {
    if (companyNameData) {
      setCompanyName(companyNameData);
    }
  }, [companyNameData]);

  useEffect(() => {
    if (totalActiveEmployees) {
      setTotalActive(totalActiveEmployees.length);
    }
  }, [totalActiveEmployees]);

  useEffect(() => {
    if (totalPayrollData) {
      setTotalPayrolls(ethers.utils.formatEther(totalPayrollData));
    }
  }, [totalPayrollData]);

  useEffect(() => {
    if (ownerData) {
      setOwner(ownerData);
    }
  }, [ownerData]);

  return (
    <Card width="30%" my={2} bgColor="#0F4C75" color="#BBE1FA">
      <CardHeader>
        <Text fontWeight="bold" align="center" fontSize="xl">
          {companyName}
        </Text>
      </CardHeader>
      <CardBody>
        <Box>
          <Text>
            <Text fontWeight="bold">Active Employees: {totalActive}</Text>
          </Text>
          <Text>
            <Text fontWeight="bold">Total payrolls: {totalPayrolls} ETH</Text>
          </Text>
        </Box>
      </CardBody>
      <CardFooter overflow="auto">
        <Box>
          <Text>
            <Text fontWeight="bold">Contract Address: </Text>
            <Link
              href={`https://sepolia.etherscan.io/address/${address}`}
              isExternal
            >
              {address}
            </Link>
          </Text>
          <Text>
            <Text fontWeight="bold">Owner: </Text>
            <Link
              href={"https://sepolia.etherscan.io/address/${owner}"}
              isExternal
            >
              {owner}
            </Link>
          </Text>
        </Box>
      </CardFooter>
      <Flex width="100%" justify="space-evenly" mb={3}>
        <Link as={NextLink} href={`/manage/${address}`} width="40%">
          <Button width="100%" colorScheme="red">
            Employer Dashboard
          </Button>
        </Link>
        <Link as={NextLink} href={`/access/${address}`} width="40%">
          <Button width="100%" colorScheme="green">
            Employee Access
          </Button>
        </Link>
      </Flex>
    </Card>
  );
}
