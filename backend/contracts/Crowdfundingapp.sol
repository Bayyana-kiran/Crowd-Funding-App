// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

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

    struct CampaignWithId {
        bytes32 campaignId;
        Campaign campaign;
    }

    mapping(bytes32 => Campaign) public campaigns;
    mapping(bytes32 => mapping(address => uint256)) public donations;
    bytes32[] public activeCampaignIds;

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

    function createCampaign(
        string memory _name,
        string memory _description,
        uint256 _goalAmount,
        uint256 _startDate,
        uint256 _endDate
    ) public {
        require(_startDate > block.timestamp + 300, "Start date must be at least 5 minutes in the future");
        require(_endDate > _startDate, "End date must be after start date");
        require(_goalAmount > 0, "Goal amount must be greater than 0");

        bytes32 campaignId = keccak256(
            abi.encodePacked(_name, msg.sender, block.timestamp)
        );

        campaigns[campaignId] = Campaign({
            ngoAdmin: msg.sender,
            name: _name,
            description: _description,
            goalAmount: _goalAmount,
            fundsRaised: 0,
            startDate: _startDate,
            endDate: _endDate,
            isPaused: false,
            isWithdrawn: false,
            isActive: true
        });

        activeCampaignIds.push(campaignId);
        emit CampaignCreated(campaignId, msg.sender, _name);
    }

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

    function pauseCampaign(bytes32 _campaignId) public {
        Campaign storage campaign = campaigns[_campaignId];
        require(msg.sender == campaign.ngoAdmin, "Only NGO admin can pause");
        require(!campaign.isPaused, "Campaign already paused");
        campaign.isPaused = true;
        emit CampaignPaused(_campaignId);
    }

    function resumeCampaign(bytes32 _campaignId) public {
        Campaign storage campaign = campaigns[_campaignId];
        require(msg.sender == campaign.ngoAdmin, "Only NGO admin can resume");
        require(campaign.isPaused, "Campaign not paused");
        campaign.isPaused = false;
        emit CampaignResumed(_campaignId);
    }

    function donate(bytes32 _campaignId) public payable {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.ngoAdmin != address(0), "Campaign does not exist");
        require(campaign.isActive, "Campaign is not active");
        require(!campaign.isPaused, "Campaign is paused");
        require(block.timestamp >= campaign.startDate, "Campaign has not started");
        require(block.timestamp <= campaign.endDate, "Campaign has ended");
        require(msg.value > 0, "Donation amount must be greater than 0");

        campaign.fundsRaised += msg.value;
        donations[_campaignId][msg.sender] += msg.value;

        emit DonationReceived(_campaignId, msg.sender, msg.value);
    }

    function withdrawFunds(bytes32 _campaignId) public {
        Campaign storage campaign = campaigns[_campaignId];
        require(msg.sender == campaign.ngoAdmin, "Only NGO admin can withdraw");
        require(!campaign.isWithdrawn, "Funds already withdrawn");
        require(campaign.fundsRaised > 0, "No funds to withdraw");

        campaign.isWithdrawn = true;
        payable(campaign.ngoAdmin).transfer(campaign.fundsRaised);
        emit FundsWithdrawn(_campaignId);
    }

    function refundDonors(bytes32 _campaignId) external onlyNGOAdmin(_campaignId) campaignExists(_campaignId) {
        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp > campaign.endDate, "Campaign is still running");
        require(!campaign.isWithdrawn, "Funds have already been withdrawn");
        require(campaign.fundsRaised > 0, "No funds to refund");

        // Mark campaign as withdrawn to prevent further refunds
        campaign.isWithdrawn = true;

        // Get the total amount to refund
        uint256 totalAmount = campaign.fundsRaised;
        
        // Reset campaign funds
        campaign.fundsRaised = 0;

        // Transfer funds back to NGO admin who will handle refunds
        payable(campaign.ngoAdmin).transfer(totalAmount);
        
        // Emit refund event
        emit RefundIssued(_campaignId, campaign.ngoAdmin, totalAmount);
    }

    function getCampaignBalance(bytes32 _campaignId) external view campaignExists(_campaignId) returns (uint256) {
        return campaigns[_campaignId].fundsRaised;
    }

    function removeCampaign(bytes32 _campaignId) external onlyNGOAdmin(_campaignId) campaignExists(_campaignId) {
        campaigns[_campaignId].isActive = false;
        emit CampaignRemoved(_campaignId);
    }

    function getAllActiveCampaigns() public view returns (CampaignWithId[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 0; i < activeCampaignIds.length; i++) {
            if (campaigns[activeCampaignIds[i]].isActive) {
                activeCount++;
            }
        }

        CampaignWithId[] memory activeCampaigns = new CampaignWithId[](activeCount);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < activeCampaignIds.length; i++) {
            bytes32 campaignId = activeCampaignIds[i];
            Campaign storage campaign = campaigns[campaignId];
            if (campaign.isActive) {
                activeCampaigns[currentIndex] = CampaignWithId(campaignId, campaign);
                currentIndex++;
            }
        }

        return activeCampaigns;
    }

    function transferToAddress(address payable _recipient) external payable {
        require(_recipient != address(0), "Invalid recipient address");
        require(msg.value > 0, "Amount must be greater than zero");

        // Transfer funds after checking conditions
        _recipient.transfer(msg.value);
        emit TransferToAddress(msg.sender, _recipient, msg.value);
    }

    function getCampaignFundsRaised(bytes32 _campaignId) public view returns (uint256) {
        return campaigns[_campaignId].fundsRaised;
    }

    function getDonationAmount(bytes32 _campaignId, address _donor) public view returns (uint256) {
        return donations[_campaignId][_donor];
    }
}
