/* USAGE: node deploy.js */
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/IdeaFactory.json');

const provider = new HDWalletProvider(
  'make fun distance firm echo mother forum train giant rare solar zoo',
  'https://rinkeby.infura.io/v3/b8051aded8e54b87b2a5aff71abaf2c5'
);
const constructorArgs = []; 
const web3 = new Web3(provider);
const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account', accounts[0]);

    let contract = new web3.eth.Contract(compiledFactory.abi);
    contract = contract.deploy({
        data: compiledFactory.evm.bytecode.object,
        arguments: constructorArgs
    });

    const newContractInstance = await contract.send({
        from: accounts[0],
        gas: 1500000,
        gasPrice: '30000000000'
    });
    console.log('Contract deployed at address: ', newContractInstance.options.address);
};
deploy();