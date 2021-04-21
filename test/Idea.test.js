/* USAGE: npm test */
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/IdeaFactory.json');
const compiledIdea = require('../ethereum/build/Idea.json');

const constructorArgs = []; 
const revertExceptionMessage = 'VM Exception while processing transaction: revert';
const gas = '1000000';

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
    gas: gas
  });

  // get Idea contract address
  [ideaAddress] = await factory.methods.getDeployedIdeas().call();

  // get the Idea contract by abi and address
  idea = await new web3.eth.Contract(
    compiledIdea.abi,
    ideaAddress
  );
});

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
        gas: gas,
        value: 100
      });
      const approver = await idea.methods.approvers(contributorAddress).call();
      assert.ok(approver > 0);
    });

    it('Minimum contribution check', async () => {
      const contributorAddress = accounts[1];
      try{
        await idea.methods.contribute().send({
          from: contributorAddress,
          gas: gas,
          value: 90
        });
        assert(false);
      } catch(ex) {
        assert.strictEqual(ex.message, revertExceptionMessage);
      }
      
      const approver = await idea.methods.approvers(contributorAddress).call();
      assert.ok(approver === '0');
    });

    it('Multiple contributers are added in the approvers list', async () => {
      const contributorAddress1 = accounts[1];
      const contributorAddress2 = accounts[2];
      const contributorAddress3 = accounts[3];
      await idea.methods.contribute().send({
        from: contributorAddress1,
        gas: gas,
        value: 100
      });
      await idea.methods.contribute().send({
        from: contributorAddress2,
        gas: gas,
        value: 200
      });
      await idea.methods.contribute().send({
        from: contributorAddress3,
        gas: gas,
        value: 300
      });
      const approver1 = await idea.methods.approvers(contributorAddress1).call();
      const approver2 = await idea.methods.approvers(contributorAddress2).call();
      const approver3 = await idea.methods.approvers(contributorAddress3).call();
      assert.ok(approver1 > 0);
      assert.ok(approver2 > 0);
      assert.ok(approver3 > 0);
    });

    it('Multiple credits', async () => {
      const contributorAddress = accounts[1];
      await idea.methods.contribute().send({
        from: contributorAddress,
        gas: gas,
        value: 250
      });
      let approver = await idea.methods.approvers(contributorAddress).call();
      assert.equal(approver, '2');
      await idea.methods.contribute().send({
        from: contributorAddress,
        gas: gas,
        value: 499
      });
      approver = await idea.methods.approvers(contributorAddress).call();
      assert.strictEqual(approver, '6');
    });

    it('Manager can create a request', async () => {
      const description = 'desc';
      const value = 200;
      const recipient = accounts[1];
      await idea.methods.createRequest(description, value, recipient).send({
        from: manager,
        gas: gas
      });
      const numOfRequests = await idea.methods.numRequests().call();
      assert.toString(numOfRequests, '1');

      const request = await idea.methods.requests(0).call();
      assert.ok(request);
      assert.strictEqual(request.description, description);
      assert.strictEqual(request.value, value.toString());
      assert.strictEqual(request.recipient, recipient);
    });

    it('Only manager can create request', async () => {
      try {
        const description = 'Buy batteries';
        const value = 200;
        const recipient = accounts[1];
        await idea.methods.createRequest(description, value, recipient).send({
          from: accounts[1],
          gas: gas
        });
        assert(false);
      } catch(ex) {
        assert.strictEqual(ex.message, revertExceptionMessage);
      }
    });

    it('Approve a request', async () => {
      const contributorAddress = accounts[1];
      await idea.methods.contribute().send({
        from: contributorAddress,
        gas: gas,
        value: 100
      });
      await idea.methods.createRequest('desc', 300, accounts[1]).send({
        from: manager,
        gas: gas
      });

      await idea.methods.approveRequest(0).send({
        from: contributorAddress,
        gas: gas
      });
      const request = await idea.methods.requests(0).call();
      assert.ok(request);
      assert.ok(request.credits, '1');
    });

    it('Approve a request with multiple credits', async () => {
      const contributorAddress = accounts[1];
      await idea.methods.contribute().send({
        from: contributorAddress,
        gas: gas,
        value: 300
      });
      await idea.methods.createRequest('desc', 300, accounts[1]).send({
        from: manager,
        gas: gas
      });

      await idea.methods.approveRequest(0).send({
        from: contributorAddress,
        gas: gas
      });
      const request = await idea.methods.requests(0).call();
      assert.ok(request);
      assert.ok(request.credits, '3');
    });

    it('Approve a request by multiple contributors', async () => {
      await idea.methods.createRequest('desc', 300, accounts[1]).send({
        from: manager,
        gas: gas
      });

      const contributorAddress1 = accounts[1];
      const contributorAddress2 = accounts[2];
      const contributorAddress3 = accounts[3];
      await idea.methods.contribute().send({
        from: contributorAddress1,
        gas: gas,
        value: 300
      });
      
      await idea.methods.contribute().send({
        from: contributorAddress2,
        gas: gas,
        value: 600
      });

      await idea.methods.contribute().send({
        from: contributorAddress3,
        gas: gas,
        value: 100
      });

      await idea.methods.approveRequest(0).send({
        from: contributorAddress1,
        gas: gas
      });

      await idea.methods.approveRequest(0).send({
        from: contributorAddress2,
        gas: gas
      });

      await idea.methods.approveRequest(0).send({
        from: contributorAddress3,
        gas: gas
      });

      const request = await idea.methods.requests(0).call();
      assert.ok(request);
      assert.ok(request.credits, '10');
    });

    it('Cannot approve a non-existing request', async () => {
      try {
        await idea.methods.approveRequest(10).send({
          from: manager,
          gas: gas
        });
        assert(false);
      } catch(ex) {
        assert.strictEqual(ex.message, revertExceptionMessage);
      }      
    }); 

    it('Cannot approve a request by a non-contributor account', async () => {
      try {
        await idea.methods.createRequest('desc', 300, accounts[1]).send({
          from: manager,
          gas: gas
        });
  
        await idea.methods.approveRequest(0).send({
          from: accounts[1],
          gas: gas
        });
        assert(false);
      } catch(ex) {
        assert.strictEqual(ex.message, revertExceptionMessage);
      }      
    });   

    it('A manager can finalize a request', async () => {
      await idea.methods.createRequest('desc', 300, accounts[3]).send({
        from: manager,
        gas: gas
      });

      const contributorAddress1 = accounts[1];
      await idea.methods.contribute().send({
        from: contributorAddress1,
        gas: gas,
        value: 300
      });
      await idea.methods.approveRequest(0).send({
        from: contributorAddress1,
        gas: gas
      });

      const balanceBeforeFinalize = await web3.eth.getBalance(accounts[3]);
      await idea.methods.finalizeRequest(0).send({
        from: manager,
        gas: gas
      });
      const balanceAfterFinalize = await web3.eth.getBalance(accounts[3]);
      assert.strictEqual(parseInt(balanceAfterFinalize) - 300, parseInt(balanceBeforeFinalize));
    }); 

    /*
    todo:
    (mai sus)
    - un approvers sa incerce sa dea approve de mai multe ori la acelasi request si sa nu reuseasca

    (aici)
    - check sa nu poata termina fara minim checks
    - sa nu poate da finalize la requests care nu exista
    - un wf complet cu mai multi contributori
    - sa nu se poata da finalize de 2 ori la un request
    */

});  