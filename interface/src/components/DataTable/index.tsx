"use client";

import {
  Avatar,
  Box,
  HStack,
  IconButton,
  Link,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useClipboard,
  useDisclosure,
} from "@chakra-ui/react";
import { FaMinus, FaPlus, FaRegCopy } from "react-icons/fa";
import { MdRefresh } from "react-icons/md";
import { useAccount, useReadContract } from "wagmi";
import { FACTORY_ABI, ACURACLE_ABI } from "@app/config";
import { FACTORY_ADDRESSES } from "@app/config";
import { moonbaseAlpha } from "viem/chains";
import { FaStackExchange } from "react-icons/fa6";
import { useState } from "react";
import AddDataSource from "../Modals/AddDataSource";
import AddProcessor from "../Modals/AddProcessor";

const Row = ({
  feed,
  onSelect,
  addProcessor,
  removeProcessor,
  addSource,
}: {
  feed: `0x${string}`;
  onSelect: (feed: `0x${string}`) => void;
  addProcessor: () => void;
  removeProcessor: () => void;
  addSource: () => void;
}) => {
  const { onCopy, hasCopied, setValue } = useClipboard("");

  const { data, refetch } = useReadContract({
    abi: ACURACLE_ABI,
    address: feed,
    functionName: "getRoundDataWithMeta",
  });

  return (
    data && (
      <Tr>
        <Td padding="16px 12px 16px 24px">
          <Text textAlign="left" fontSize="14px">
            {data[2]}
          </Text>
        </Td>
        <Td padding="16px 12px">
          <HStack>
            <Avatar src="" name="BNB" boxSize="1.5rem" />
            <Text textAlign="left" fontSize="14px">
              {moonbaseAlpha.name}
            </Text>
          </HStack>
        </Td>
        <Td padding="16px 12px">
          <Text textAlign="left" fontSize="14px">
            {Number(data[0])}
          </Text>
        </Td>
        <Td padding="16px 12px">
          <Text textAlign="left" fontSize="14px">
            {Number(data[1])}
          </Text>
        </Td>
        <Td padding="16px 12px">
          <HStack>
            <Link
              href={`https://moonbase.moonscan.io/address/${feed}`}
              target="_blank"
              color="#375bd2"
            >
              {`${feed.substring(0, 6)}...${feed.substring(38)}`}
            </Link>
            <Tooltip label={hasCopied ? "Copied!" : "Copy"} placement="top">
              <IconButton
                icon={<FaRegCopy />}
                aria-label="copy"
                onClick={() => {
                  setValue("hello");
                  onCopy();
                }}
              />
            </Tooltip>
          </HStack>
        </Td>
        <Td padding="15px 12px">
          <HStack>
            <Tooltip label="Add processor" placement="top">
              <IconButton
                icon={<FaPlus />}
                aria-label="add processor"
                onClick={() => {
                  onSelect(feed);
                  addProcessor();
                }}
              />
            </Tooltip>
            <Tooltip label="Remove processor" placement="top">
              <IconButton
                icon={<FaMinus />}
                aria-label="remove processor"
                onClick={() => {
                  onSelect(feed);
                  removeProcessor();
                }}
              />
            </Tooltip>
            <Tooltip label="Add price source" placement="top">
              <IconButton
                icon={<FaStackExchange />}
                aria-label="add price processor"
                onClick={() => {
                  onSelect(feed);
                  addSource();
                }}
              />
            </Tooltip>
            <Tooltip label="Refresh feed" placement="top">
              <IconButton
                icon={<MdRefresh />}
                aria-label="refresh"
                onClick={() => refetch}
              />
            </Tooltip>
          </HStack>
        </Td>
      </Tr>
    )
  );
};

export default function DataTable() {
  const { address } = useAccount();
  const account = address ? address : "0x";

  const { data } = useReadContract({
    abi: FACTORY_ABI,
    address: FACTORY_ADDRESSES[moonbaseAlpha.id],
    functionName: "getFeeds",
    args: [account],
  });

  const [selectedFeed, setSelectedFeed] = useState<`0x${string}`>("0x");
  const {
    isOpen: isAddPOpen,
    onClose: onCloseAddP,
    onOpen: onOpenAddP,
  } = useDisclosure();

  const {
    isOpen: isRemOpen,
    onClose: onCloseRem,
    onOpen: onOpenRem,
  } = useDisclosure();

  const {
    isOpen: isAddSrcOpen,
    onClose: onCloseAddSrc,
    onOpen: onOpenAddSrc,
  } = useDisclosure();

  return (
    <>
      <Box w="full" overflow="auto">
        <Table>
          <Thead>
            <Tr>
              <Th padding="8px 12px 8px 24px">
                <Text textAlign="left" fontSize="14px" fontWeight={600}>
                  Feed
                </Text>
              </Th>
              <Th padding="8px 12px">
                <Text textAlign="left" fontSize="14px" fontWeight={600}>
                  Network
                </Text>
              </Th>
              <Th padding="8px 12px">
                <Text textAlign="left" fontSize="14px" fontWeight={600}>
                  Answer
                </Text>
              </Th>
              <Th padding="8px 12px">
                <Text textAlign="left" fontSize="14px" fontWeight={600}>
                  Processors
                </Text>
              </Th>
              <Th padding="8px 12px">
                <Text textAlign="left" fontSize="14px" fontWeight={600}>
                  Contract Address
                </Text>
              </Th>
              <Th padding="8px 12px">
                <Text textAlign="left" fontSize="14px" fontWeight={600}>
                  Actions
                </Text>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.map((feed, key) => (
              <Row
                feed={feed}
                addProcessor={onOpenAddP}
                removeProcessor={onOpenRem}
                addSource={onOpenAddSrc}
                onSelect={setSelectedFeed}
                key={key}
              />
            ))}
          </Tbody>
        </Table>
      </Box>
      <AddDataSource
        isOpen={isAddSrcOpen}
        onClose={onCloseAddSrc}
        targetContract={selectedFeed}
      />
      <AddProcessor
        isOpen={isAddPOpen}
        onClose={onCloseAddP}
        targetContract={selectedFeed}
      />
    </>
  );
}
