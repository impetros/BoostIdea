import web3 from './web3';
import IdeaFactory from './build/IdeaFactory.json';


const instance = new web3.eth.Contract(
  IdeaFactory.abi,
  '0x1832e84F25C9D9cFA0a6610765212e7a5438AC4A'
);

export default instance;