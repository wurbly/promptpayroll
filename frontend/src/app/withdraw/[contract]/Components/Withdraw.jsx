import { useState, useEffect } from "react";
import { Flex, Box, Heading, Text, Button, Spinner } from "@chakra-ui/react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";

export default function Withdraw({ contractAddress, abi, setConnectionError }) {
  const [txHash, setTxHash] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: abi,
    functionName: "withdrawSalary",
    onError(error) {
      setConnectionError(`Error: ${error.message}`);
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
      setStatusMessage("Waiting for withdrawal");
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

  const handleClick = async () => {
    write();
  };

  return (
    <Flex direction="column" width="45%" bgColor="#0F4C75" p={3}>
      <Heading align="center" fontSize="2xl" my={3}>
        Withdraw
      </Heading>
      <Text>
        Click "Withdraw" to withdraw any accrued salaries for the month!
      </Text>
      <Text>
        Note: Ensure that you are signed in with your registered address on the
        contract.
      </Text>
      <Text mb={3}>
        If you wish to withdraw to a separate address, please change the
        receiving address using the change address form on the right before
        withdrawing!
      </Text>
      <Text mb={3}>
        (Any unclaimed salaries will be automatically sent to your registered
        address at the end of the month)
      </Text>
      <Button colorScheme="green" onClick={handleClick}>
        {!isLoading && "Withdraw"}
        {isLoading && <Spinner />}
      </Button>
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
    </Flex>
  );
}
