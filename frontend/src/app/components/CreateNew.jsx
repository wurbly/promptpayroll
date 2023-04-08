"use client";

import { useState, useEffect } from "react";
import { Box, Heading, Text, Spinner, Link } from "@chakra-ui/react";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";

import {
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Button,
} from "@chakra-ui/react";

export default function CreateNew() {
  const [companyName, setCompanyName] = useState("");
  const [txHash, setTxHash] = useState("");
  const [walletConnectStatus, setWalletConnectStatus] = useState("");
  const [transactionStatus, setTransactionStatus] = useState("");

  const { address, isConnecting, isConnected, isDisconnected, status } =
    useAccount();

  const { config } = usePrepareContractWrite({
    address: "0x9CeF7EdFe1A1c3C9679ED1F1Bc2d2ceEAFf76723",
    abi: [
      {
        inputs: [
          {
            internalType: "string",
            name: "_companyName",
            type: "string",
          },
        ],
        name: "createNewContract",
        outputs: [],
        stateMutability: "nonpayable",
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
        name: "deployedContracts",
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
        name: "getDeployedContracts",
        outputs: [
          {
            internalType: "address[]",
            name: "_deployedContracts",
            type: "address[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "createNewContract",
    args: [companyName],
  });

  const {
    data,
    isIdle,
    isLoading,
    isSuccess,
    isError,
    write,
    error,
    status: txStatus,
  } = useContractWrite(config);

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
    if (isIdle) {
      setTransactionStatus("Enter company name and click 'Create Contract'.");
    } else if (isLoading) {
      setTransactionStatus("Please approve the transaction");
    } else if (isSuccess) {
      setTransactionStatus("Transaction sent!");
    } else if (isError) {
      setTransactionStatus(`Error: ${error.message}`);
    }
  }, [txStatus]);

  useEffect(() => {
    if (data) {
      setTxHash(data.hash);
    }
  }, [data]);

  const handleChange = (evt) => {
    setCompanyName(evt.target.value);
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    write();
    setCompanyName("");
  };

  return (
    <Box width="50%" mb={5}>
      <Heading mb={3}>Set up a new payroll contract</Heading>
      <Box width="100%" bgColor="#0F4C75" p={3}>
        <Text textAlign={"center"}>{walletConnectStatus}</Text>
      </Box>
      <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel mt={3}>Company Name:</FormLabel>
          <Input type="text" value={companyName} onChange={handleChange} />
          <FormHelperText color="#BBE1FA" mb={3}>
            This will require gas to change after initial set-up.
          </FormHelperText>
        </FormControl>
        <Button type="submit" colorScheme="red" mb={3} p="auto">
          {isLoading ? <Spinner /> : "Create Contract"}
        </Button>
      </form>
      <Box width="100%" bgColor="#0F4C75" p={3} mb={3}>
        <Text>{transactionStatus}</Text>
        {txHash && (
          <Text>
            Txhash:&nbsp;
            <Link href={`https://sepolia.etherscan.io/tx/${txHash}`} isExternal>
              {txHash}
            </Link>
          </Text>
        )}
      </Box>
      <hr />
    </Box>
  );
}
