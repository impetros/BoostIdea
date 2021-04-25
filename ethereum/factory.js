import web3 from './web3';
import IdeaFactory from './build/IdeaFactory.json';


const instance = new web3.eth.Contract(
  IdeaFactory.abi,
  '0xA1E30974452222e934BF1EAc793DFA991fFc4cAF'
);

export default instance;