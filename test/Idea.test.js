/* USAGE: npm test */
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/IdeaFactory.json');
const compiledIdea = require('../ethereum/build/Idea.json');

const constructorArgs = []; 

let manager;
let accounts;
let factory;
let ideaAddress;
let idea;

beforeEach(async () => {
  // get all accounts from provider
  accounts = await web3.eth.getAccounts();
  manager = accounts[0];

  // get contract with abi (interface)
  let contract = new web3.eth.Contract(compiledFactory.abi);

  // deploy the contract
  contract = contract.deploy({
      data: compiledFactory.evm.bytecode.object,
      arguments: constructorArgs
  });

  // send it to the network
  factory = await contract.send({
      from: manager,
      gas: 1500000,
      gasPrice: '30000000000'
  });

  // create an Idea contract
  await factory.methods.createIdea('100').send({
    from: manager,
    gas: '1000000'
  });

  // get Idea contract address
  [ideaAddress] = await factory.methods.getDeployedIdeas().call();

  // get the Idea contract by abi and address
  idea = await new web3.eth.Contract(
    compiledIdea.abi,
    ideaAddress
  );
});

/* TODO unit tests

  -minimum contribution
  -check how credits work
  -requests
*/

describe('Ideas', () => {
    it('Deploys a factory and a idea', () => {
      assert.ok(factory.options.address);
      assert.ok(idea.options.address);
    });

    it('The manager is the correct one', async () => {
      const actualManager = await idea.methods.manager().call();
      assert.strictEqual(actualManager, manager);
    });

    it('The contributer is added in the approvers list', async () => {
      const contributorAddress = accounts[1];
      await idea.methods.contribute().send({
        from: contributorAddress,
        gas: '1000000',
        value: 100
      });
      const approver = await idea.methods.approvers(contributorAddress).call();
      assert.ok(approver);
    });

    
});  