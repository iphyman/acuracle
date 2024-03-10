"use client";

import { ACURACLE_ABI } from "@app/config";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

type Address = `0x${string}`;

export default function AddProcessor({
  isOpen,
  onClose,
  targetContract,
}: Pick<ModalProps, "isOpen" | "onClose"> & { targetContract: Address }) {
  const [processor, setProcessor] = useState<string>("");
  const toast = useToast();

  const {
    writeContract,
    isPending,
    isSuccess,
    data: hash,
  } = useWriteContract();

  const handle = () => {
    writeContract({
      abi: ACURACLE_ABI,
      address: targetContract,
      functionName: "addProcessor",
      args: [processor as Address],
    });
  };

  useEffect(() => {
    if (isSuccess) {
      onClose();
    }
  }, [isSuccess, onClose]);

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (isConfirming) {
      toast({
        title: "Confirming....",
        description: "Transaction is awaiting confirmation",
        status: "success",
        duration: 15000,
        isClosable: true,
      });
    }
  }, [isConfirming, toast]);

  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add processor</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack w="full" spacing={6}>
            <FormControl isRequired>
              <FormLabel>Processor address</FormLabel>
              <Input
                placeholder="0x..."
                onChange={(e) => setProcessor(e.target.value)}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handle}>
            Add processor
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
