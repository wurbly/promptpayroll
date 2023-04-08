import { useState, useEffect } from "react";
import {
  Flex,
  Box,
  Heading,
  Text,
  Link,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { useContractWrite, usePrepareContractWrite } from "wagmi";

export default function DepositForm({ contractAddress, abi, salaries }) {
  const [txHash, setTxHash] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [monthDays, setMonthDays] = useState("");
  const [salaryPayable, setSalaryPayable] = useState("1512451161613613");

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: abi,
    functionName: "depositSalaries",
    args: [monthDays],
    overrides: {
      value: salaryPayable,
    },
  });

  const {
    data,
    isIdle,
    isLoading,
    isSuccess,
    isError,
    error,
    write,
    status: txStatus,
  } = useContractWrite(config);

  useEffect(() => {
    if (isIdle) {
      setStatusMessage("Waiting for transaction");
    } else if (isLoading) {
      setStatusMessage("Confirm transaction on your wallet");
    } else if (isSuccess) {
      setStatusMessage("Transaction sent!");
    } else if (isError) {
      setStatusMessage(`Error: ${error.message}`);
    }
  }, [txStatus]);

  useEffect(() => {
    if (data) {
      setTxHash(data.hash);
    }
  }, [data]);

  useEffect(() => {
    if (salaries) {
      setSalaryPayable(ethers.utils.parseEther(salaries).toHexString());
    }
  }, [salaries]);

  const handleChange = (evt) => {
    setMonthDays(evt.target.value);
  }
  
  const handleSubmit = (evt) => {
    evt.preventDefault();
    write();
    setMonthDays("");
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel mt={3}>Days this Month</FormLabel>
          <Input type="text" value={monthDays} onChange={handleChange} />
          <FormHelperText color="#BBE1FA" mb={3}>
            Confirm that the total salaries are correkt.
            Once deposited, you will not be able to withdraw unless you close the Company.
          </FormHelperText>
        </FormControl>
        <Button type="submit" colorScheme="green" width="100%">
          {!isLoading && "Deposit Salaries"}
          {isLoading && <Spinner />}
        </Button>
      </form>
      <Box>
        <Text>{statusMessage}</Text>
        {txHash && (
          <Text>
            Txhash:&nbsp;
            <Link href={`https://sepolia.etherscan.io/tx/${txHash}`} isExternal>
              {txHash}
            </Link>
          </Text>
        )}
      </Box>
    </Box>
  );
}
