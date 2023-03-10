# Prerequisite
- Ganache (https://www.trufflesuite.com/ganache) for Running local Ethereum network
- NodeJS (https://nodejs.org/en/) for build, test, and running Frontend application
- Truffle (https://www.trufflesuite.com/truffle) for compile and deploy Smart contract
- Metamask Chrome's extension for manage accounts and transations. 

## Truffle configuration
Truffle environment is located in `truffle` directory, with predefined configures (`truffle-config.js`):
  - Development network (using Ganache):
    - Host: 127.0.0.1 (`localhost`)
    - Port: 7545
    - Network Id: 5777

## Ganache configuration

Ganache's workspace should be created based on `truffle-config.js`.


## MetaMask configuration

Add new Network by selecting `Custom RPC` with corresponding RPC Address, Port and Network ID.

# Deploy and Configure Frontend

Use truffle to complie and deploy the Main Contract.
 + truffle compile
 + truffle migrate --reset
 + truffle test (if needed)
 
Replace the Main Contract Address in `config.js` with new deployed address.

Execute `npm start` to run frontend.

# Frontend Development

All function connecting with Smart contract are located in `index.js` with `TODO:` prefix. 
