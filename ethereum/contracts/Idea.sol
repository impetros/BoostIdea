pragma solidity ^0.8.3;

contract Idea {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping (address => bool) approvals;
    }
    
    //Request[] public requests;
    uint public numRequests;
    mapping (uint => Request) public requests;
    
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;

    modifier allowOnlyManager() {
        require(msg.sender == manager);
        _;
    }
    
    constructor(uint minimum) {
        manager = msg.sender;
        minimumContribution = minimum;
    }
    
    function contribute() public payable {
        require(msg.value > minimumContribution);

        approvers[msg.sender] = true;
        approversCount++;
    }
    
    function createRequest(string memory description, uint value, address recipient) public allowOnlyManager {
        Request storage r = requests[numRequests++];
        r.description = description;
        r.value = value;
        r.recipient = recipient;
        r.complete = false;
        r.approvalCount = 0;
    }
}