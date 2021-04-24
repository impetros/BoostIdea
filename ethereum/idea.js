import web3 from './web3';
import Idea from './build/Idea.json';

export default address => {
  return new web3.eth.Contract(Idea.abi, address);
};