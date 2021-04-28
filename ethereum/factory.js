import web3 from './web3';
import IdeaFactory from './build/IdeaFactory.json';


const instance = new web3.eth.Contract(
  IdeaFactory.abi,
  '0xb779d5167d75f99be410cF8763D6b71988bE5E3d'
);

export default instance;