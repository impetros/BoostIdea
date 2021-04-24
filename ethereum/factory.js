import web3 from './web3';
import IdeaFactory from './build/IdeaFactory.json';


const instance = new web3.eth.Contract(
  IdeaFactory.abi,
  '0x20Cd7E55C42D4E6a0e2F561219214F8daA871B17'
);

export default instance;