"use client";

import DataTable from "@app/components/DataTable";
import CreateFeedModal from "@app/components/Modals/CreateFeedModal";
import {
  Box,
  Button,
  HStack,
  Icon,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { FaDatabase, FaPlus } from "react-icons/fa";

export default function Feeds() {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <Box w="full">
        <Box w="full" px="4rem" mx="auto">
          <VStack w="full" alignItems="flex-start">
            <HStack w="full" justifyContent="space-between">
              <HStack spacing={5} my="3rem">
                <Icon as={FaDatabase} boxSize="2rem" />
                <Text fontSize="2rem" fontWeight={600}>
                  Data Feeds
                </Text>
              </HStack>
              <Button colorScheme="gray" leftIcon={<FaPlus />} onClick={onOpen}>
                Create Feed
              </Button>
            </HStack>
            <DataTable />
          </VStack>
        </Box>
      </Box>
      <CreateFeedModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
