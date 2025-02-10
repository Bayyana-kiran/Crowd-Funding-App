// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Crowdfundingapp {
    struct Campaign {
        address ngoAdmin;
        string name;
        string description;
        uint256 goalAmount;
        uint256 fundsRaised;
        uint256 startDate;
        uint256 endDate;
        bool isPaused;
        bool isWithdrawn;
        bool isActive;
    }

    mapping(bytes32 => Campaign) public campaigns;
    mapping(bytes32 => mapping(address => uint256)) public donations;
    uint256 public campaignCount;

    event CampaignCreated(bytes32 indexed campaignId, address indexed ngoAdmin, string name);
    event CampaignUpdated(bytes32 indexed campaignId, string name, string description, uint256 goalAmount, uint256 startDate, uint256 endDate);
    event CampaignPaused(bytes32 indexed campaignId);
    event CampaignResumed(bytes32 indexed campaignId);
    event DonationReceived(bytes32 indexed campaignId, address indexed donor, uint256 amount);
    event FundsWithdrawn(bytes32 indexed campaignId);
    event RefundIssued(bytes32 indexed campaignId, address indexed donor, uint256 amount);
    event CampaignRemoved(bytes32 indexed campaignId);
    event TransferToAddress(address indexed sender, address indexed recipient, uint256 amount);

    modifier onlyNGOAdmin(bytes32 _campaignId) {
        require(msg.sender == campaigns[_campaignId].ngoAdmin, "Not campaign admin");
        _;
    }
    
    modifier campaignExists(bytes32 _campaignId) {
        require(campaigns[_campaignId].ngoAdmin != address(0), "Campaign does not exist");
        require(campaigns[_campaignId].isActive, "Campaign is inactive");
        _;
    }

    // Function to create a new campaign with starting and ending date
    function createCampaign(
        string memory _name,
        string memory _description,
        uint256 _goalAmount,
        uint256 _startDate, // Starting date of the campaign
        uint256 _endDate   // Ending date of the campaign
    ) external {
        require(_goalAmount > 0, "Goal amount must be greater than zero");
        require(_startDate > block.timestamp, "Start date must be in the future");
        require(_endDate > _startDate, "End date must be after start date");

        bytes32 campaignId = keccak256(abi.encodePacked(campaignCount));
        campaigns[campaignId] = Campaign(
            msg.sender, 
            _name, 
            _description, 
            _goalAmount, 
            0, 
            _startDate, 
            _endDate, 
            false, 
            false, 
            true
        );
        
        emit CampaignCreated(campaignId, msg.sender, _name);
        campaignCount++;
    }

    // Function to update an existing campaign with new details
    function updateCampaign(
        bytes32 _campaignId, 
        uint256 _goalAmount, 
        uint256 _startDate, 
        uint256 _endDate
    ) external onlyNGOAdmin(_campaignId) campaignExists(_campaignId) {
        require(_goalAmount > 0, "Goal amount must be greater than zero");
        require(_startDate > block.timestamp, "Start date must be in the future");
        require(_endDate > _startDate, "End date must be after start date");

        Campaign storage campaign = campaigns[_campaignId];
        campaign.goalAmount = _goalAmount;
        campaign.startDate = _startDate;
        campaign.endDate = _endDate;

        // Emitting the updated campaign details
        emit CampaignUpdated(
            _campaignId, 
            campaign.name, 
            campaign.description, 
            _goalAmount, 
            _startDate, 
            _endDate
        );
    }

    // Function to pause a campaign
    function pauseCampaign(bytes32 _campaignId) external onlyNGOAdmin(_campaignId) campaignExists(_campaignId) {
        campaigns[_campaignId].isPaused = true;
        emit CampaignPaused(_campaignId);
    }

    // Function to resume a paused campaign
    function resumeCampaign(bytes32 _campaignId) external onlyNGOAdmin(_campaignId) campaignExists(_campaignId) {
        campaigns[_campaignId].isPaused = false;
        emit CampaignResumed(_campaignId);
    }

    // Function to donate to a campaign
    function donate(bytes32 _campaignId) external payable campaignExists(_campaignId) {
        Campaign storage campaign = campaigns[_campaignId];
        require(!campaign.isPaused, "Campaign is paused");
        require(block.timestamp >= campaign.startDate, "Campaign has not started yet"); // Check if the current time is after the start date
        require(block.timestamp <= campaign.endDate, "Campaign has ended"); // Check if the current time is before the end date
        
        campaign.fundsRaised += msg.value;
        donations[_campaignId][msg.sender] += msg.value;
        emit DonationReceived(_campaignId, msg.sender, msg.value);
    }

    // Function for the NGO to withdraw funds after the campaign ends
    function withdrawFunds(bytes32 _campaignId) external onlyNGOAdmin(_campaignId) campaignExists(_campaignId) {
        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp > campaign.endDate, "Campaign is still running");
        require(campaign.fundsRaised >= campaign.goalAmount, "Goal not met");
        require(!campaign.isWithdrawn, "Funds already withdrawn");
        
        campaign.isWithdrawn = true;
        payable(campaign.ngoAdmin).transfer(campaign.fundsRaised);
        emit FundsWithdrawn(_campaignId);
    }

    // Function to issue refunds to donors if the campaign fails
    function refundDonors(bytes32 _campaignId) external onlyNGOAdmin(_campaignId) campaignExists(_campaignId) {
        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp > campaign.endDate, "Campaign is still running");

        // Loop through all donors for this campaign
        for (uint256 i = 0; i < campaignCount; i++) {
            address donor = msg.sender;
            uint256 amount = donations[_campaignId][donor];
            if (amount > 0) {
                donations[_campaignId][donor] = 0;
                payable(donor).transfer(amount);
                emit RefundIssued(_campaignId, donor, amount);
            }
        }
    }

    // Function to get the current balance of a campaign
    function getCampaignBalance(bytes32 _campaignId) external view campaignExists(_campaignId) returns (uint256) {
        return campaigns[_campaignId].fundsRaised;
    }

    // Function to remove a campaign (set it as inactive)
    function removeCampaign(bytes32 _campaignId) external onlyNGOAdmin(_campaignId) campaignExists(_campaignId) {
        campaigns[_campaignId].isActive = false;
        emit CampaignRemoved(_campaignId);
    }

    // New function to return all active campaigns
    // Define a new struct to include campaignId
struct CampaignWithId {
    bytes32 campaignId;
    Campaign campaign;
}

function getAllActiveCampaigns() external view returns (CampaignWithId[] memory) {
    uint256 activeCount = 0;

    // First, count how many active campaigns exist
    for (uint256 i = 0; i < campaignCount; i++) {
        bytes32 campaignId = keccak256(abi.encodePacked(i));
        if (campaigns[campaignId].isActive) {
            activeCount++;
        }
    }

    // Create an array to store active campaigns along with their IDs
    CampaignWithId[] memory activeCampaigns = new CampaignWithId[](activeCount);
    uint256 index = 0;

    // Populate the array with active campaigns
    for (uint256 i = 0; i < campaignCount; i++) {
        bytes32 campaignId = keccak256(abi.encodePacked(i));
        if (campaigns[campaignId].isActive) {
            activeCampaigns[index] = CampaignWithId({
                campaignId: campaignId,
                campaign: campaigns[campaignId]
            });
            index++;
        }
    }

    return activeCampaigns;
    }


    // Transfer function with checks for security
    function transferToAddress(address payable _recipient) external payable {
        require(_recipient != address(0), "Invalid recipient address");
        require(msg.value > 0, "Amount must be greater than zero");

        // Transfer funds after checking conditions
        _recipient.transfer(msg.value);
        emit TransferToAddress(msg.sender, _recipient, msg.value);
    }
}
