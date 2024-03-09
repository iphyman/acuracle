"use client";

import { Box, HStack, IconButton, Link } from "@chakra-ui/react";
import { FaDiscord, FaGithub } from "react-icons/fa";

export const Navbar = () => {
  return (
    <Box w="full" h="4.5rem">
      <HStack w="full" h="full" px="2rem" justifyContent="space-between">
        <Link
          href="/"
          fontSize="2rem"
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
          <Link href="" fontSize="1.5rem" _hover={{ opacity: 0.5 }}>
            <FaDiscord />
          </Link>
        </HStack>
      </HStack>
    </Box>
  );
};
