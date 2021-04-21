pragma solidity ^0.8.3;

contract IdeaFactory {
    Idea[] public deployedIdeas;

    function createIdea(uint minimum) public {
        Idea newIdea = new Idea(minimum, msg.sender);
        deployedIdeas.push(newIdea);
    }

    function getDeployedIdeas() public view returns (Idea[] memory) {
        return deployedIdeas;
    }
}


contract Idea {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint credits;
        mapping (address => bool) approvals;
    }
    
    uint public numRequests;
    mapping (uint => Request) public requests;
    
    address public manager;
    
    uint public numUniqueApprovers;
    mapping(address => uint) public approvers;

    uint public oneCreditValue;
    uint public credits;

    modifier allowOnlyManager() {
        require(msg.sender == manager);
        _;
    }
    
    constructor(uint creditValue, address sender) {
        manager = sender;
        oneCreditValue = creditValue;
    }
    
    function contribute() public payable {
        require(msg.value >= oneCreditValue);

        if(approvers[msg.sender] == 0) {
            numUniqueApprovers++;
        } 

        uint value = msg.value / oneCreditValue;
        approvers[msg.sender] += value;
        credits += value;
        
        // calculate the change 
        uint change = msg.value % oneCreditValue;
        
        // send the change back to the approver
        if(change != 0) {
            address payable senderAddress = payable(msg.sender);
            senderAddress.transfer(change);
        }
    }
    
    function createRequest(string memory description, uint value, address payable recipient) public allowOnlyManager {
        Request storage r = requests[numRequests++];
        r.description = description;
        r.value = value;
        r.recipient = recipient;
        r.complete = false;
        r.credits = 0;
    }
    
    function approveRequest(uint index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender] > 0);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.credits += approvers[msg.sender];
    }

    function finalizeRequest(uint index) public allowOnlyManager {
        Request storage request = requests[index];

        require(request.credits > (credits / 2));
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;
    }
}