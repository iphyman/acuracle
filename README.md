# ACURACLE

Acuracle serves as a no-code oracle onboarding dApp for Acurast, a decentralized serverless cloud platform. It enables non-developers to effortlessly initiate a new oracle data price feed on any EVM blockchain. Our user-friendly interface simplifies the deployment of on-chain oracle contracts and facilitates the generation of necessary job scripts for automating and updating data feeds through Acurast. Presently, we offer support for aggregating price data from Binance, Kucoin, and Bybit exchanges.

## How we use Acurast

We are using acurast to fetch asset price from exchanges and committing the data on-chain in decentralized trustless manner. After deploying the oracle contract, users needs to create a job using the acurast UI and copying the script generated from the acuracle platform to completely create their data feed. In essence Acurast is the underlying tech automating and updating the deployed on-chain price feed.

## How we built it

The project folder consist of two folders

- contracts
- interface

### Contracts

The oracle contract is written in solidity and consist of the following files;

- Acuracle.sol
- AcuracleFeedFactory.sol

The factory contract is responsible for creating new data feeds for users and is deployed on the moonbase alpha for this demo. It exposes 2 major interface. `createFeed` and `getFeeds` as the names imply, users can deploy new data feeds by calling the factory `createFeed` which takes a string as an argument to describe the feed been deployed.
Acuracle.sol is the feed implementation contract which exposes interfaces to consume and update the oracle data both on-chain and in frontend. More details can be found on the interface files.

## Demo
<iframe src="https://player.vimeo.com/video/921834869?h=c3ab8f2eff" width="640" height="343" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
<p><a href="https://vimeo.com/921834869">Acuracle demo</a> from <a href="https://vimeo.com/user177758279">Emmanuel</a> on <a href="https://vimeo.com">Vimeo</a>.</p>