// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LandManagement {
    // Role definitions
    enum Roles {
        None,
        ChiefSecretary,
        Collector,
        Registrar,
        LandOwner
    }

    // Land Details
    struct Land {
        uint256 thandaperNumber;
        address owner;
        string taluk;
        string village;
        uint256 surveyNumber;
        uint256 area;
        string landTitle;
        bool exists;
        uint256 ownershipStartTime;
        address[] previousOwners;
        uint256 marketValue;
        string geoLocation;
    }

    // Sale Request
    struct SaleRequest {
        uint256 thandaperNumber;
        address seller;
        address buyer;
        bool sellerConfirmed;
        bool buyerConfirmed;
        bool registrarApproved;
    }

    // User Identity
    struct UserIdentity {
        string governmentId;     
        bool isVerified;         
        bool isBlocked;         
    }

    // Recovery Request
    struct RecoveryRequest {
        string governmentId;
        address newAddress;
        uint256 requestTime;
        bool isActive;
    }

    // Mappings
    mapping(address => Roles) public userRoles;
    mapping(uint256 => Land) public lands;
    mapping(uint256 => SaleRequest) public saleRequests;
    mapping(address => uint256[]) private userOwnedLands;
    mapping(address => UserIdentity) public userIdentities;
    mapping(string => address) private govIdToAddress;
    mapping(string => RecoveryRequest) private recoveryRequests;

    // Add a mapping to track all active recovery govIds
    mapping(uint256 => string) private activeRecoveryGovIds;
    uint256 private recoveryRequestCount;

    // Keep track of all registered land IDs
    uint256[] private allLandIds;

    // Events
    event LandRegistered(uint256 indexed thandaperNumber, address indexed owner);
    event SaleRequested(uint256 indexed thandaperNumber, address indexed seller, address indexed buyer);
    event SaleConfirmedBySeller(uint256 indexed thandaperNumber, address indexed seller);
    event SaleConfirmedByBuyer(uint256 indexed thandaperNumber, address indexed buyer);
    event SaleApprovedByRegistrar(uint256 indexed thandaperNumber, address indexed registrar);
    event UserRegistered(address indexed user, string govId);
    event AccountBlocked(address indexed user, uint256 timestamp);
    event AccountUnblocked(address indexed user, uint256 timestamp);
    event RecoveryRequested(string indexed govId, address indexed newAddress);
    event RecoveryCompleted(string indexed govId, address indexed oldAddress, address indexed newAddress);

    constructor() {
        userRoles[msg.sender] = Roles.ChiefSecretary;
    }

    // Modifiers
    modifier onlyRole(Roles role) {
        require(userRoles[msg.sender] == role, "Access denied");
        _;
    }

    modifier landExists(uint256 thandaperNumber) {
        require(lands[thandaperNumber].exists, "Land does not exist");
        _;
    }

    modifier notBlocked(address user) {
        require(!userIdentities[user].isBlocked, "Account is blocked");
        _;
    }

    modifier onlyVerifiedUser() {
        require(userIdentities[msg.sender].isVerified, "User not verified");
        _;
    }

    modifier onlyChiefSecretary() {
        require(userRoles[msg.sender] == Roles.ChiefSecretary, "Only Chief Secretary can perform this action");
        _;
    }

    // Role Management
    function setUserRole(address user, Roles role) public onlyChiefSecretary {
        require(user != address(0), "Invalid address");
        require(userIdentities[user].isVerified, "User not registered");
        userRoles[user] = role;
    }

    // User Registration
    function registerUser(string memory govId) public {
        require(!userIdentities[msg.sender].isVerified, "User already registered");
        require(govIdToAddress[govId] == address(0), "Government ID already registered");
        
        UserIdentity storage newUser = userIdentities[msg.sender];
        newUser.governmentId = govId;
        newUser.isVerified = true;
        newUser.isBlocked = false;
        
        govIdToAddress[govId] = msg.sender;
        userRoles[msg.sender] = Roles.LandOwner;
        
        emit UserRegistered(msg.sender, govId);
    }

    // Land Registration
    function registerLand(
        uint256 thandaperNumber,
        address owner,
        string memory taluk,
        string memory village,
        uint256 surveyNumber,
        uint256 area,
        string memory landTitle,
        string memory geoLocation,
        uint256 marketValue
    ) public onlyRole(Roles.Registrar) {
        require(!lands[thandaperNumber].exists, "Land already registered");
        require(userIdentities[owner].isVerified, "Owner must be a verified user");
        require(userRoles[owner] == Roles.LandOwner, "Owner must have LandOwner role");
        
        Land storage newLand = lands[thandaperNumber];
        newLand.thandaperNumber = thandaperNumber;
        newLand.owner = owner;
        newLand.taluk = taluk;
        newLand.village = village;
        newLand.surveyNumber = surveyNumber;
        newLand.area = area;
        newLand.landTitle = landTitle;
        newLand.exists = true;
        newLand.ownershipStartTime = block.timestamp;
        newLand.geoLocation = geoLocation;
        newLand.marketValue = marketValue;
        newLand.previousOwners = new address[](0); // Initialize the array

        userOwnedLands[owner].push(thandaperNumber);
        allLandIds.push(thandaperNumber);
        emit LandRegistered(thandaperNumber, owner);
    }

    // View Functions
    function getOwnedLands(address owner) public view returns (uint256[] memory) {
        return userOwnedLands[owner];
    }

    function getLandDetails(uint256 thandaperNumber) public view 
        returns (
            address owner,
            string memory taluk,
            string memory village,
            uint256 surveyNumber,
            uint256 area,
            string memory landTitle,
            uint256 ownershipStartTime,
            string memory geoLocation,
            uint256 marketValue
        ) {
        Land storage land = lands[thandaperNumber];
        require(land.exists, "Land does not exist");
        
        return (
            land.owner,
            land.taluk,
            land.village,
            land.surveyNumber,
            land.area,
            land.landTitle,
            land.ownershipStartTime,
            land.geoLocation,
            land.marketValue
        );
    }

    function getLands() public view returns (uint256[] memory) {
        return allLandIds;
    }

    function isGovIdRegistered(string memory govId) public view returns (bool) {
        return govIdToAddress[govId] != address(0);
    }

    // Sale Functions
    function initiateSaleRequest(
        uint256 thandaperNumber,
        address buyer
    ) public landExists(thandaperNumber) notBlocked(msg.sender) onlyVerifiedUser {
        Land storage land = lands[thandaperNumber];
        require(land.owner == msg.sender, "You are not the owner of this land");
        require(userIdentities[buyer].isVerified, "Buyer must be a verified user");
        require(userRoles[buyer] == Roles.LandOwner, "Buyer must have LandOwner role");

        saleRequests[thandaperNumber] = SaleRequest({
            thandaperNumber: thandaperNumber,
            seller: msg.sender,
            buyer: buyer,
            sellerConfirmed: false,
            buyerConfirmed: false,
            registrarApproved: false
        });

        emit SaleRequested(thandaperNumber, msg.sender, buyer);
    }

    function confirmSaleBySeller(uint256 thandaperNumber) public notBlocked(msg.sender) onlyVerifiedUser {
        SaleRequest storage saleRequest = saleRequests[thandaperNumber];
        require(saleRequest.seller == msg.sender, "You are not the seller");
        saleRequest.sellerConfirmed = true;
        emit SaleConfirmedBySeller(thandaperNumber, msg.sender);
    }

    function confirmSaleByBuyer(uint256 thandaperNumber) public notBlocked(msg.sender) onlyVerifiedUser {
        SaleRequest storage saleRequest = saleRequests[thandaperNumber];
        require(saleRequest.buyer == msg.sender, "You are not the buyer");
        saleRequest.buyerConfirmed = true;
        emit SaleConfirmedByBuyer(thandaperNumber, msg.sender);
    }

 function approveSaleByRegistrar(uint256 thandaperNumber) public onlyRole(Roles.Registrar) {
        SaleRequest storage saleRequest = saleRequests[thandaperNumber];
        require(saleRequest.sellerConfirmed && saleRequest.buyerConfirmed, "Sale not confirmed by both parties");
        saleRequest.registrarApproved = true;

        Land storage land = lands[thandaperNumber];
        
        // Transfer ownership
        land.previousOwners.push(land.owner); 
        land.owner = saleRequest.buyer;
        land.ownershipStartTime = block.timestamp;

        // Update ownership records
        for (uint i = 0; i < userOwnedLands[saleRequest.seller].length; i++) {
            if (userOwnedLands[saleRequest.seller][i] == thandaperNumber) {
                userOwnedLands[saleRequest.seller][i] = userOwnedLands[saleRequest.seller][userOwnedLands[saleRequest.seller].length - 1];
                userOwnedLands[saleRequest.seller].pop();
                break;
            }
        }
        userOwnedLands[saleRequest.buyer].push(thandaperNumber);

        delete saleRequests[thandaperNumber];
        emit SaleApprovedByRegistrar(thandaperNumber, msg.sender);
    }

    // Recovery Functions
    function initiateRecovery(string memory govId) public {
        require(!userIdentities[msg.sender].isVerified, "New address already registered");
        
        address oldAddress = govIdToAddress[govId];
        require(oldAddress != address(0), "Government ID not found");
        require(oldAddress != msg.sender, "Cannot recover to same address");

        recoveryRequests[govId] = RecoveryRequest({
            governmentId: govId,
            newAddress: msg.sender,
            requestTime: block.timestamp,
            isActive: true
        });

        UserIdentity storage oldUser = userIdentities[oldAddress];
        oldUser.isBlocked = true;

        activeRecoveryGovIds[recoveryRequestCount] = govId;
        recoveryRequestCount++;

        emit RecoveryRequested(govId, msg.sender);
        emit AccountBlocked(oldAddress, block.timestamp);
    }

   function approveRecovery(string memory govId) public onlyRole(Roles.Collector) {
    RecoveryRequest storage request = recoveryRequests[govId];
    require(request.isActive, "No active recovery request");
    
    address oldAddress = govIdToAddress[govId];
    address newAddress = request.newAddress;

    // Transfer identity
    UserIdentity storage newIdentity = userIdentities[newAddress];
    
    newIdentity.governmentId = govId;
    newIdentity.isVerified = true;
    newIdentity.isBlocked = false;
    
    govIdToAddress[govId] = newAddress;
    userRoles[newAddress] = userRoles[oldAddress];
    userRoles[oldAddress] = Roles.None;

    // Transfer lands
    uint256[] memory ownedLands = userOwnedLands[oldAddress];
    for(uint i = 0; i < ownedLands.length; i++) {
        lands[ownedLands[i]].owner = newAddress;
        userOwnedLands[newAddress].push(ownedLands[i]);
    }
    
    // Cleanup
    delete userOwnedLands[oldAddress];
    delete userIdentities[oldAddress];
    delete recoveryRequests[govId];

    // Remove from active recoveries
    for(uint256 i = 0; i < recoveryRequestCount; i++) {
        if(keccak256(bytes(activeRecoveryGovIds[i])) == keccak256(bytes(govId))) {
            activeRecoveryGovIds[i] = activeRecoveryGovIds[recoveryRequestCount - 1];
            delete activeRecoveryGovIds[recoveryRequestCount - 1];
            recoveryRequestCount--;
            break;
        }
    }
    
    emit RecoveryCompleted(govId, oldAddress, newAddress);
}

    // Account Security Functions
    function blockAccount(string memory govId) public {
        address userAddress = govIdToAddress[govId];
        require(userAddress != address(0), "User not found");
        require(msg.sender == userAddress || userRoles[msg.sender] == Roles.Collector, "Unauthorized");

        UserIdentity storage user = userIdentities[userAddress];
        user.isBlocked = true;

        emit AccountBlocked(userAddress, block.timestamp);
    }

    function unblockAccount(address userAddress) public onlyRole(Roles.Collector) {
        require(userIdentities[userAddress].isBlocked, "Account not blocked");
        
        UserIdentity storage user = userIdentities[userAddress];
        user.isBlocked = false;
        
        emit AccountUnblocked(userAddress, block.timestamp);
    }

    function getRecoveryRequest(string memory govId) public view returns (
        string memory governmentId,
        address newAddress,
        uint256 requestTime,
        bool isActive
    ) {
        RecoveryRequest storage request = recoveryRequests[govId];
        return (
            request.governmentId,
            request.newAddress,
            request.requestTime,
            request.isActive
        );
    }

    function getAllRecoveryRequests() public view returns (string[] memory) {
        string[] memory result = new string[](recoveryRequestCount);
        
        for(uint256 i = 0; i < recoveryRequestCount; i++) {
            result[i] = activeRecoveryGovIds[i];
        }
        
        return result;
    }
}