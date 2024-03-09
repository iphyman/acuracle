"use client";

import { Box, Button, chakra, HStack, Text, VStack } from "@chakra-ui/react";
import { FaArrowRight } from "react-icons/fa";

export default function Home() {
  return (
    <Box w="full">
      <VStack w="full" justifyContent="center" pt="5rem">
        <Text
          fontSize="4rem"
          maxW="18ch"
          fontWeight={800}
          textAlign="center"
          lineHeight={1.2}
          letterSpacing="tighter"
          mb="1rem"
        >
          Create decentralized data feeds with
          <chakra.span pl="10px" color="teal">
            Acurast
          </chakra.span>
        </Text>
        <Text
          maxW="35rem"
          mx="auto"
          color="gray.400"
          fontSize="1.25rem"
          lineHeight={1.2}
          textAlign="center"
        >
          Acurast provides a secure, reliable and decentralized serverless cloud
          compute to power endless unique smart contract use cases.
        </Text>
        <HStack w="full" mt="2rem" justifyContent="center" spacing="5">
          <Button
            as="a"
            href="https://acurast.com/"
            target="_blank"
            w="16rem"
            colorScheme="teal"
            rightIcon={<FaArrowRight />}
            h="4rem"
            paddingInline="2.5rem"
            fontSize="1.2rem"
          >
            Learn more
          </Button>
          <Button
            w="16rem"
            colorScheme="gray"
            h="4rem"
            paddingInline="2.5rem"
            fontSize="1.2rem"
          >
            Launch a data feed
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}
