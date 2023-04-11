"use client";

import { Flex, Box, Text } from "@chakra-ui/react";
import Links from "./Links";

export default function Header() {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      bgColor="#3282B8"
      p={3}
      mt={10}
    >
      <Box py={3}>
        <Text>😶 wurbs was here 😶</Text>
      </Box>
      <Box py={3}>
        <Links />
      </Box>
    </Flex>
  );
}
