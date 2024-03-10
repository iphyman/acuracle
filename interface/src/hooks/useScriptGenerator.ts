export const SUPPORTED_EXCHANGES = ["binance", "kucoin", "bybit"] as const;
export type SupportedExchange = (typeof SUPPORTED_EXCHANGES)[number];

export function useScriptGenerator(
  destination: string,
  exchange: SupportedExchange,
  symbol: string
) {
  const getParserUrl = () => {
    switch (exchange) {
      case "binance":
        return {
          url: `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`,
          parser: `JSON.parse(response)["price"] * 10 ** 8`,
        };

      case "bybit":
        return {
          url: `https://api-testnet.bybit.com/v5/market/tickers?category=spot&symbol=${symbol}`,
          parser: `JSON.parse(response)["result"]["list"][0]["lastPrice"] * 10 ** 8`,
        };

      case "kucoin":
        return {
          url: `https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=${symbol}`,
          parser: `JSON.parse(response)["data"]["price"] * 10 ** 8`,
        };

      default:
        return {
          url: `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`,
          parser: `JSON.parse(response)["price"] * 10 ** 8`,
        };
    }
  };

  const { url, parser } = getParserUrl();

  const template = `
    httpGET(
        "${url}",
        {},
        (response, _certificate) => {
            const price = ${parser};
            const payload = "0x" + price.toString(16);
            _STD_.chains.ethereum.fulfill(
                "https://rpc.api.moonbase.moonbeam.network",
                "${destination}",
                payload,
                {
                    methodSignature: "submit(int256)",
                    gasLimit: "9000000",
                    maxFeePerGas: "2550000000",
                    maxPriorityFeePerGas: "2550000000",
                },
                (opHash) => {
                    console.log("Succeeded: " + opHash)
                },
                (err) => {
                    console.log("Failed: " + err)
                },
            )
        },
        (err) => {
            console.log("Failed: " + err)
        }
    );
`;

  return { template };
}
