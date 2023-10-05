# ShareMint Token Claims

## Setup

```shell
npm install
```

## Running the tests

```shell
npm test
```

## Steps

0. For a real contract we won't be creating a new token. Set `TOKEN_ADDRESS` env var. You can set it to `CREATE_TOKEN` to create a new token.
1. Deploy a new token and contract: `TOKEN_ADDRESS=0x431CD3C9AC9Fc73644BF68bF5691f4B83F9E104f npm run deploy:polygon`
2. Set new token and contract address in `.env` file
3. Send contract tokens (see command below)

## Running the scripts

### Deploy a new claims contract

```shell
npm run deploy:local
```

```shell
npm run deploy:sepolia
```

```shell
npm run deploy:polygon
```

### Set Merkle Root

Set 0x1234 to the merkle root.

```shell
MERKLE_ROOT=0x1234 npx hardhat run scripts/updateMerkleRoot.ts --network sepolia
```

### Get Merkle Root

```shell
npx hardhat run scripts/getMerkleRoot.ts --network sepolia
```

### Get Claimed Amount

```shell
ADDRESS=0x1234 npx hardhat run scripts/getClaimedAmount.ts --network sepolia
```

### Send Tokens To Claim Contract

```shell
AMOUNT=1000 npx hardhat run scripts/sendTokensToClaimContract.ts --network sepolia
```

## Hardhat

```shell
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat test --typecheck
npx hardhat node
```

### Deploy contract locally

```shell
npx hardhat node
```

And in another tab:

```shell
npm run deploy
```
