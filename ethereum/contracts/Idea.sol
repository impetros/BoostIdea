pragma solidity ^0.8.3;

contract IdeaFactory {
    Idea[] public deployedIdeas;

    function createIdea(
        uint256 minimum,
        uint256 reachGoal,
        string memory name,
        string memory shortDescription,
        string memory description,
        string memory imageURL,
        Idea.Category category,
        bool isDonation
    ) public {
        Idea newIdea =
            new Idea(
                minimum,
                reachGoal,
                name,
                shortDescription,
                description,
                imageURL,
                category,
                isDonation,
                msg.sender
            );
        deployedIdeas.push(newIdea);
    }

    function getDeployedIdeas() public view returns (Idea[] memory) {
        return deployedIdeas;
    }
}

contract Idea {
    enum Category {
        TECHNOLOGY,
        FILM_VIDEOS,
        EDUCATION,
        MEDICAL,
        FASHION,
        DESIGN,
        OTHERS
    }

    struct Request {
        string description;
        uint256 value;
        address payable recipient;
        bool complete;
        uint256 credits;
        uint256 createdAt;
        mapping(address => bool) approvals;
    }

    string public name;
    string public shortDescription;
    string public description;
    string public imageURL;
    Category public category;
    bool public isDonation;

    uint256 createdAt;

    uint256 public numRequests;
    mapping(uint256 => Request) public requests;

    address public manager;

    uint256 public numUniqueApprovers;
    mapping(address => uint256) public approvers;

    uint256 public oneCreditValue;
    uint256 public credits;

    uint256 public reachGoal;

    modifier allowOnlyManager() {
        require(msg.sender == manager);
        _;
    }

    constructor(
        uint256 creditValue,
        uint256 ideaReachGoal,
        string memory ideaName,
        string memory ideaShortDescription,
        string memory ideaDescription,
        string memory ideaImageURL,
        Category ideaCategory,
        bool ideaIsDonation,
        address sender
    ) {
        manager = sender;
        oneCreditValue = creditValue;
        reachGoal = ideaReachGoal;
        name = ideaName;
        shortDescription = ideaShortDescription;
        description = ideaDescription;
        imageURL = ideaImageURL;
        category = ideaCategory;
        isDonation = ideaIsDonation;
        createdAt = block.timestamp;
    }

    function contribute() public payable {
        require(msg.value >= oneCreditValue);

        if (approvers[msg.sender] == 0) {
            numUniqueApprovers++;
        }

        uint256 value = msg.value / oneCreditValue;
        approvers[msg.sender] += value;
        credits += value;

        // calculate the change
        uint256 change = msg.value % oneCreditValue;

        // send the change back to the approver
        if (change != 0) {
            address payable senderAddress = payable(msg.sender);
            senderAddress.transfer(change);
        }
    }

    function createRequest(
        string memory requestDescription,
        uint256 value,
        address payable recipient
    ) public allowOnlyManager {
        Request storage r = requests[numRequests++];
        r.description = requestDescription;
        r.value = value;
        r.recipient = recipient;
        r.complete = false;
        r.credits = 0;
        r.createdAt = block.timestamp;
    }

    function approveRequest(uint256 index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender] > 0);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.credits += approvers[msg.sender];
    }

    function finalizeRequest(uint256 index) public allowOnlyManager {
        Request storage request = requests[index];

        require(request.credits > (credits / 2));
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary()
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            Category,
            bool,
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
        return (
            name,
            shortDescription,
            imageURL,
            category,
            isDonation,
            oneCreditValue,
            credits,
            createdAt,
            reachGoal
        );
    }
    
    function getMoreDetails()
        public
        view
        returns (
            string memory,
            uint256,
            uint256,
            address
        )
    {
        return (
            description,
            numRequests,
            address(this).balance,
            manager
        );
    }
}


