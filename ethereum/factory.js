import web3 from './web3';
import IdeaFactory from './build/IdeaFactory.json';


const instance = new web3.eth.Contract(
  IdeaFactory.abi,
  '0xD602A5e63030BC8243715b36fC8e34bb855eB455'
);

export default instance;