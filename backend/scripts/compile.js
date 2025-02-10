import solc from 'solc';
import fs from 'fs';
import path from 'path';

const contractPath = path.resolve('contracts', 'Crowdfundingapp.sol');
const source = fs.readFileSync(contractPath, 'utf8');

const input = {
    language: 'Solidity',
    sources: {
        'Crowdfundingapp.sol': {
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

const output = JSON.parse(solc.compile(JSON.stringify(input)));
const contract = output.contracts['Crowdfundingapp.sol']['Crowdfundingapp'];

fs.writeFileSync(
    path.resolve('src/contracts', 'Crowdfundingapp.json'),
    JSON.stringify({
        abi: contract.abi,
        bytecode: contract.evm.bytecode.object,
    })
); 