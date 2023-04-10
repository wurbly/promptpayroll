"use client";

import { useState, useEffect } from "react";
import { Flex, Box, Heading, Link, Button, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { useContractRead } from "wagmi";
import ContractCard from "./components/ContractCard";

export default function Directory() {
  const [numContracts, setNumContracts] = useState(0);
  const [deployedContracts, setDeployedContracts] = useState([]);
  const [cards, setCards] = useState("");

  const { data } = useContractRead({
    address: "0x3910B7fC6D16FA3973c10ac8C6182980D5D26231",
    abi: [
      {
        inputs: [
          {
            internalType: "string",
            name: "newCompanyName",
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
    functionName: "getDeployedContracts",
    watch: true,
  });

  useEffect(() => {
    if (data) {
      setDeployedContracts([...data]);
    }
  }, [data]);

  useEffect(() => {
    if (deployedContracts) {
      setCards(renderCards());
    }
  }, [deployedContracts]);

  useEffect(() => {
    if (deployedContracts) {
      setNumContracts(deployedContracts.length);
    }
  });

  const renderCards = () => {
    return deployedContracts.map((address, index) => {
      return <ContractCard key={index} address={address} />;
    });
  };

  return (
    <Flex direction="column">
      <Heading align="center" mb={5}>
        PromptPayroll Company Directory
      </Heading>
      <Flex justify="center" align="center" mb={5} direction="row">
        <Box>
          <Text fontSize="75" p={"auto"}>
            ✨
          </Text>
        </Box>
        <Box align="center">
          <Text
            align="center"
            mb={3}
            bgGradient="linear(to-l, #0F4C75, #3282B8, #BBE1FA)"
            bgClip="text"
            fontSize="xl"
            fontWeight="extrabold"
          >
            {numContracts} companies already trust PromptPayroll for their
            payroll needs!
          </Text>
          <Text align="center" mb={3}>
            What are you waiting for?
          </Text>
          <Button colorScheme="cyan">
            <Link as={NextLink} href="/" align="center">
              Deploy your PromptPayroll contract today!
            </Link>
          </Button>
        </Box>
        <Box>
          <Text fontSize="75">✨</Text>
        </Box>
      </Flex>
      <Box align="center" mb={5}>
        <Text>
          Find your company below to manage your company or withdraw your
          salary!
        </Text>
        <Text>(CTRL/CMD + F to find your Company Name)</Text>
      </Box>
      <Flex justify="space-evenly" width="100%" wrap="wrap">
        {cards}
      </Flex>
    </Flex>
  );
}
