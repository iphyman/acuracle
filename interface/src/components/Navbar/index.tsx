"use client";

import { Box, HStack, Link } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";

export const Navbar = () => {
  return (
    <Box w="full" h="4.5rem">
      <HStack w="full" h="full" px="4rem" justifyContent="space-between">
        <Link
          href="/"
          fontSize={{ base: "1rem", md: "2rem" }}
          color="white"
          fontWeight={700}
          _hover={{ textDecoration: "none" }}
        >
          Acuracle
        </Link>
        <HStack h="full" spacing={7}>
          <Link href="" fontSize="1.5rem" _hover={{ opacity: 0.5 }}>
            <FaGithub />
          </Link>
          <w3m-button />
        </HStack>
      </HStack>
    </Box>
  );
};
