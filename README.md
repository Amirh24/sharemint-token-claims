# ShareMint Token Claims

## Setup

```shell
npm install
```

## Running the tests

```shell
npm test
```

## Running the scripts

```shell
npm run deploy
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
