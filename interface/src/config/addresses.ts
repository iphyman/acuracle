import { moonbaseAlpha } from "viem/chains";

type AddressMap = { [chainId: number]: `0x${string}` };

export const FACTORY_ADDRESSES: AddressMap = {
  [moonbaseAlpha.id]: "0xD3E651fd64AE0eD2f5D21CeF3d76b828F7c06074",
};
