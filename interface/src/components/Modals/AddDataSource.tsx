"use client";

import {
  SUPPORTED_EXCHANGES,
  SupportedExchange,
  useScriptGenerator,
} from "@app/hooks";
import {
  Button,
  Code,
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
  Select,
  Tooltip,
  VStack,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaCopy } from "react-icons/fa";

export default function AddDataSource({
  isOpen,
  onClose,
  targetContract,
}: Pick<ModalProps, "isOpen" | "onClose"> & { targetContract: `0x${string}` }) {
  const [exchange, setExchange] = useState<SupportedExchange>("binance");
  const [symbol, setSymbol] = useState<string>("");
  const { template } = useScriptGenerator(targetContract, exchange, symbol);
  const { onCopy, hasCopied } = useClipboard(template);

  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Generate Job Script</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack w="full" spacing={6}>
            <FormControl isRequired>
              <FormLabel>Exchange</FormLabel>
              <Select
                placeholder="Select Exchange"
                onChange={(e) =>
                  setExchange(e.target.value as SupportedExchange)
                }
              >
                {SUPPORTED_EXCHANGES.map((dx, key) => (
                  <option value={dx} key={key}>
                    {dx.toUpperCase()}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Ticker Symbol</FormLabel>
              <Input
                placeholder="BTC-USD"
                onChange={(e) => setSymbol(e.target.value)}
              />
            </FormControl>
            <Code>{template}</Code>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Tooltip label={hasCopied ? "Copied!" : "Copy"}>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={onCopy}
              rightIcon={<FaCopy />}
            >
              Copy code
            </Button>
          </Tooltip>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
