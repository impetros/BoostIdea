const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

// builder folder path
const buildPath = path.resolve(__dirname, 'build');
// delete the build folder
fs.removeSync(buildPath);

// Compile contract
const contractPath = path.resolve(__dirname, 'contracts', 'Idea.sol');
const source = fs.readFileSync(contractPath, 'utf8');
const input = {
   language: 'Solidity',
   sources: {
      'Idea.sol': {
         content: source,
      },
   },
   settings: {
      outputSelection: {
         '*': {
            '*': ['*'],
         },
      },
   },
};

const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts['Idea.sol'];

// create the build folder
fs.ensureDirSync(buildPath);

// write the compiled contracts into build folder
for (let contract in output) {
    fs.outputJsonSync(
      path.resolve(buildPath, contract.replace(':', '') + '.json'),
      output[contract]
    );
}

console.log("Compiled successfully!");