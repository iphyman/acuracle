"use client";

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
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import FACTORY_ABI from "@app/abis/factory.json";
import { FACTORY_ADDRESSES } from "@app/config";
import { moonbaseAlpha } from "viem/chains";

export default function CreateFeedModal({
  isOpen,
  onClose,
}: Pick<ModalProps, "isOpen" | "onClose">) {
  const [name, setName] = useState<string>("");
  const toast = useToast();
  const {
    writeContract,
    isPending,
    isSuccess,
    data: hash,
  } = useWriteContract();

  const createFeed = () => {
    writeContract({
      abi: FACTORY_ABI,
      address: FACTORY_ADDRESSES[moonbaseAlpha.id],
      functionName: "createFeed",
      args: [name],
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
        <ModalHeader>Create Data Feed</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl isRequired>
            <FormLabel>Feed</FormLabel>
            <Input
              placeholder="BTC/USD"
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            isDisabled={name.length < 3}
            isLoading={isPending || isConfirming}
            onClick={createFeed}
          >
            Create Feed
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
