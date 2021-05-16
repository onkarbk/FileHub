# Link to Notion Docs Page: https://www.notion.so/FileHub-b907091b8c8b4d7bb7f8f7525232580a

# Link to Demo Video: https://youtu.be/lkm7k1zyecs

# What is FileHub? 

The present-day digital arena faces increasing risks of financial frauds, theft, etc. Such crimes call for reliable ways to safeguard people’s digital assets while transferring them. FileHub is a decentralized solution that would allow users to share only the Encrypted Hash of the file and the recipient can then decrypt it by using their unique key. The service employs IPFS(Inter-Planetary File System) to store the documents in a decentralized database. And the data can be retrieved only by the trusted recipient and the users themselves. The Encrypted Hash of the location of the document on the IPFS is stored on Ethereum using a smart contract. 

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

#FileHub Docs
## Technologies used:

- Ethereum/Solidity Smart Contracts
- React
- Web3JS
- IPFS(Inter-Planetary File System)

## Assumptions about the user:

The User has Metamask installed to interact with DApp. The recepient need not have Metamask installed and only needs the Encrypted Hash to interact with the DApp.

## The Solidity Smart Contract:

The smart contract permanently resides on the Goerli Testnet. The Contract Address is: 0x11783B9A3E4992fdDcea76dd6275Ac659dccD686. Smart Contract was Deployed using Remix IDE.

It can be accessed via Etherscan using the link: 

[https://goerli.etherscan.io/address/0x11783b9a3e4992fddcea76dd6275ac659dccd686](https://goerli.etherscan.io/address/0x11783b9a3e4992fddcea76dd6275ac659dccd686)
![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/6c1a9ea4-b124-4fb7-becf-efe3f6611280/Screen_Shot_2021-05-16_at_6.04.02_PM_(2).png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/6c1a9ea4-b124-4fb7-becf-efe3f6611280/Screen_Shot_2021-05-16_at_6.04.02_PM_(2).png)

`pragma solidity ^0.4.17;
contract Contract {
 string ipfsHash;
 
 function sendHash(string x) public {
   ipfsHash = x;
 }

 function getHash() public view returns (string x) {
   return ipfsHash;
 }
}`

## IPFS

In this project we used the [ipfs.infura.io](http://ipfs.infura.io) node to deploy the files and get the Hash.

`const IPFS = require(‘ipfs-api’);
const ipfs = new IPFS({ host: ‘ipfs.infura.io’, port: 5001, protocol: ‘https’ });`

## App.js

The order of flow of App.js is as follows: 
1. Set the state variables.
2. Capture the User’s file.
3. Capture recipient's email
4. Convert the file to a buffer.
5. Send the buffered file to IPFS
6. IPFS returns a hash.
7. Get the User’s MetaMask Ethereum address
8. Send the IPFS for storage on Ethereum.
9. Using MetaMask, User will confirm the transaction to Ethereum.
10. The IPFS hash is then encrypted using the recipient's email. The encrypted hash is then sent to the smart contract. 
11. Ethereum contract will return a transaction hash number.
12. The transaction hash number can be used to generate a transaction receipt with information such as the amount of gas used and the block number.
13. The IPFS and Ethereum information will render as it becomes available in a table using Bootstrap for CSS. NOTE: I didn’t create an isLoading type variable to automatically re-render state for the blockNumber and gasUsed variables. So for now, you will have to click again or implement your own loading icon. 

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/fd30ae6e-d2ab-47ed-a6da-da683033929c/Screen_Shot_2021-05-16_at_6.10.03_PM_(2).png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/fd30ae6e-d2ab-47ed-a6da-da683033929c/Screen_Shot_2021-05-16_at_6.10.03_PM_(2).png)

## Recipient:

The recipient can enter the Encrypted Hash for IPFS and their email which acts as the key to obtain the URL of the the file. 

Ideally a Unique ID would have been used to encrypt the file before deployment. But as this is just a Minimum Viable Product to show working and proof of concept, we have settled to use the email id of the recipient as the security key.

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/2136e070-92e9-4517-8fce-f255b3d33cad/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/2136e070-92e9-4517-8fce-f255b3d33cad/Untitled.png)
