// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LandManagement {
    // Role definitions
    enum Roles {
        None,
        ChiefSecretary,
        Collector,
        Tahsildar,
        VillageOfficer,
        SubRegistrar,
        SeniorRegistrar,
        LandOwner
    }

    // Land Types
    enum LandType {
        Agricultural,
        Forest,
        Urban,
        Rural,
        Coastal,
        Wetland,
        Government
    }

    // Simplified Land Details
    struct Land {
        uint256 thandaperNumber;
        address owner;
        string taluk;
        string village;
        uint256 surveyNumber;
        uint256 area;
        LandType landType;
        string landTitle;
        bool protectedStatus;  // renamed from isProtected
        bool exists;
        uint256 taxAmount;
        uint256 ownershipStartTime;
        string[] previousOwners;
        uint256 marketValue;
        string geoLocation;
        mapping(uint256 => TaxPayment) taxHistory;
        uint256 taxPaymentCount;
    }

    // Tax payments
    struct TaxPayment {
        uint256 amount;
        uint256 timestamp;
        bool isPaid;
    }

    // Sale Request
    struct SaleRequest {
        uint256 thandaperNumber;
        address seller;
        address buyer;
        bool sellerConfirmed;
        bool buyerConfirmed;
        bool registrarVerified;
        bool seniorRegistrarApproved;
    }

    // Death Transfer Request
    struct DeathTransferRequest {
        uint256 thandaperNumber;
        address beneficiary;
        bool beneficiaryApproved;
        bool anonymousRegistrarApproved;
        bool seniorRegistrarApproved;
    }

     // New User Identity struct
    struct UserIdentity {
        string governmentId;     // Government ID hash
        bool isVerified;         // Verification status
        bool isBlocked;          // If true, all transactions are blocked
        address recoveryAddress; // Secondary recovery address
        bytes32 backupHash;     // Hash of backup data for recovery
        uint256 lastBlockTime;  // Timestamp of last block request
        mapping(address => bool) trustedContacts; // List of trusted contacts who can help in recovery
    }

    struct RecoveryRequest {
    address newAddress;
    uint256 timestamp;
    bool isActive;
}

    // Essential Mappings
    mapping(address => Roles) public userRoles;
    mapping(uint256 => Land) public lands;
    mapping(uint256 => SaleRequest) public saleRequests;
    mapping(uint256 => DeathTransferRequest) public deathTransferRequests;
    mapping(address => uint256[]) private userOwnedLands;
      // New mappings for user security
    mapping(address => UserIdentity) public userIdentities;
    mapping(string => address) private govIdToAddress;      // Map government IDs to addresses
    mapping(address => RecoveryRequest) private recoveryRequests;
    mapping(bytes32 => bool) private usedRecoveryCodes;     // Track used recovery codes

    // Events (keep only essential events)
    event LandRegistered(uint256 indexed thandaperNumber, address indexed owner);
    event SaleRequested(uint256 indexed thandaperNumber, address indexed seller, address indexed buyer);
    event SaleConfirmedBySeller(uint256 indexed thandaperNumber, address indexed seller);
    event SaleConfirmedByBuyer(uint256 indexed thandaperNumber, address indexed buyer);
    event SaleVerifiedByRegistrar(uint256 indexed thandaperNumber, address indexed registrar);
    event SaleApprovedBySeniorRegistrar(uint256 indexed thandaperNumber, address indexed seniorRegistrar);
    event DeathTransferInitiated(uint256 indexed thandaperNumber, address indexed beneficiary);
    event DeathTransferApprovedByBeneficiary(uint256 indexed thandaperNumber, address indexed beneficiary);
    event DeathTransferApprovedByAnonymousRegistrar(uint256 indexed thandaperNumber);
    event DeathTransferFinalized(uint256 indexed thandaperNumber, address indexed beneficiary);
    event LandTypeChangeRequested(uint256 indexed thandaperNumber, LandType newLandType);
    event LandTypeChangeApproved(uint256 indexed thandaperNumber, LandType newLandType);
    event TaxPaid(uint256 indexed thandaperNumber, address indexed payer, uint256 amount);
        // Events for security operations
    event UserRegistered(address indexed user, string govId);
    event AccountBlocked(address indexed user, uint256 timestamp);
    event AccountUnblocked(address indexed user, uint256 timestamp);
    event RecoveryRequested(address indexed user, uint256 timestamp);
    event RecoveryCompleted(address indexed oldAddress, address indexed newAddress);
    event TrustedContactAdded(address indexed user, address indexed contact);

    constructor() {
        userRoles[msg.sender] = Roles.ChiefSecretary;
    }

    // Modified modifiers
    modifier onlyRole(Roles role) {
        require(userRoles[msg.sender] == role, "Access denied");
        _;
    }

    modifier landExists(uint256 thandaperNumber) {
        require(lands[thandaperNumber].exists, "Land does not exist");
        _;
    }

    modifier isProtected(uint256 thandaperNumber) {
        require(lands[thandaperNumber].protectedStatus, "Land is not protected");
        _;
    }

    modifier isNotProtected(uint256 thandaperNumber) {
        require(!lands[thandaperNumber].protectedStatus, "Land is protected");
        _;
    }

    modifier isValidTaxAmount(uint256 thandaperNumber, uint256 amount) {
        require(lands[thandaperNumber].taxAmount == amount, "Invalid tax amount");
        _;
    }
     // New modifiers
    modifier notBlocked(address user) {
        require(!userIdentities[user].isBlocked, "Account is blocked");
        _;
    }

    modifier onlyVerifiedUser() {
        require(userIdentities[msg.sender].isVerified, "User not verified");
        _;
    }

    // Core functionality: Register new land
    function registerLand(
        uint256 thandaperNumber,
        address owner,
        string memory taluk,
        string memory village,
        uint256 surveyNumber,
        uint256 area,
        LandType landType,
        string memory landTitle,
        bool protectedStatus,
        uint256 taxAmount,
        string memory geoLocation,
        uint256 marketValue
    ) public onlyRole(Roles.SubRegistrar) {
        require(!lands[thandaperNumber].exists, "Land already registered");
        
        Land storage newLand = lands[thandaperNumber];
        newLand.thandaperNumber = thandaperNumber;
        newLand.owner = owner;
        newLand.taluk = taluk;
        newLand.village = village;
        newLand.surveyNumber = surveyNumber;
        newLand.area = area;
        newLand.landType = landType;
        newLand.landTitle = landTitle;
        newLand.protectedStatus = protectedStatus;
        newLand.exists = true;
        newLand.taxAmount = taxAmount;
        newLand.ownershipStartTime = block.timestamp;
        newLand.geoLocation = geoLocation;
        newLand.marketValue = marketValue;

        userOwnedLands[owner].push(thandaperNumber);
        emit LandRegistered(thandaperNumber, owner);
    }


    // Core functionality: Get owned lands
    function getOwnedLands(address owner) public view returns (uint256[] memory) {
        return userOwnedLands[owner];
    }

    // Core functionality: Get land details
    function getLandDetails(uint256 thandaperNumber) public view 
        returns (
            address owner,
            string memory taluk,
            string memory village,
            uint256 surveyNumber,
            uint256 area,
            LandType landType,
            string memory landTitle,
            bool protectedStatus,
            uint256 taxAmount,
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
            land.landType,
            land.landTitle,
            land.protectedStatus,
            land.taxAmount,
            land.ownershipStartTime,
            land.geoLocation,
            land.marketValue
        );
    }

    // Register user with government ID
    function registerUser(string memory govId) public {
        require(!userIdentities[msg.sender].isVerified, "User already registered");
        require(govIdToAddress[govId] == address(0), "Government ID already registered");
        
        UserIdentity storage newUser = userIdentities[msg.sender];
        newUser.governmentId = govId;
        newUser.isVerified = true;
        newUser.isBlocked = false;
        
        govIdToAddress[govId] = msg.sender;
        
        emit UserRegistered(msg.sender, govId);
    }

    // Block account in case of compromise
    function blockAccount(string memory govId) public {
        address userAddress = govIdToAddress[govId];
        require(userAddress != address(0), "User not found");
        require(
            msg.sender == userAddress || 
            userRoles[msg.sender] == Roles.SeniorRegistrar,
            "Unauthorized"
        );

        UserIdentity storage user = userIdentities[userAddress];
        user.isBlocked = true;
        user.lastBlockTime = block.timestamp;

        emit AccountBlocked(userAddress, block.timestamp);
    }

    // Unblock account after verification
    function unblockAccount(address userAddress) public onlyRole(Roles.SeniorRegistrar) {
        require(userIdentities[userAddress].isBlocked, "Account not blocked");
        
        UserIdentity storage user = userIdentities[userAddress];
        user.isBlocked = false;
        
        emit AccountUnblocked(userAddress, block.timestamp);
    }

    // Add trusted contact for recovery
    function addTrustedContact(address contact) public onlyVerifiedUser {
        require(contact != msg.sender, "Cannot add self as trusted contact");
        require(userIdentities[contact].isVerified, "Contact must be verified");
        
        userIdentities[msg.sender].trustedContacts[contact] = true;
        
        emit TrustedContactAdded(msg.sender, contact);
    }

    // Initiate recovery process
  function initiateRecovery(
    string memory govId,
    address newAddress,
    bytes32 backupHash
) public {
    address oldAddress = govIdToAddress[govId];
    require(oldAddress != address(0), "User not found");
    require(!usedRecoveryCodes[backupHash], "Recovery code already used");
    require(newAddress != address(0), "Invalid new address");
    require(newAddress != oldAddress, "New address must be different");
    
    UserIdentity storage user = userIdentities[oldAddress];
    require(user.backupHash == backupHash, "Invalid backup hash");
    
    recoveryRequests[oldAddress] = RecoveryRequest({
        newAddress: newAddress,
        timestamp: block.timestamp,
        isActive: true
    });
    
    emit RecoveryRequested(oldAddress, block.timestamp);
}

// Updated complete recovery function to use the new RecoveryRequest struct
function completeRecovery(
    string memory govId,
    address oldAddress,
    address newAddress
) public onlyRole(Roles.SeniorRegistrar) {
    require(govIdToAddress[govId] == oldAddress, "Invalid government ID");
    
    RecoveryRequest storage request = recoveryRequests[oldAddress];
    require(request.isActive, "No active recovery request found");
    require(request.newAddress == newAddress, "Address mismatch with recovery request");
    
    // Transfer identity to new address
    UserIdentity storage oldUser = userIdentities[oldAddress];
    UserIdentity storage newUser = userIdentities[newAddress];
    
    newUser.governmentId = oldUser.governmentId;
    newUser.isVerified = true;
    newUser.isBlocked = false;
    
    // Update government ID mapping
    govIdToAddress[govId] = newAddress;
    
    // Transfer land ownership
    uint256[] memory ownedLands = userOwnedLands[oldAddress];
    for(uint i = 0; i < ownedLands.length; i++) {
        lands[ownedLands[i]].owner = newAddress;
        userOwnedLands[newAddress].push(ownedLands[i]);
    }
    
    delete userOwnedLands[oldAddress];
    delete userIdentities[oldAddress];
    delete recoveryRequests[oldAddress];
    
    emit RecoveryCompleted(oldAddress, newAddress);
}
    // Sale Request
    function initiateSaleRequest(
        uint256 thandaperNumber,
        address buyer
    ) public landExists(thandaperNumber) notBlocked(msg.sender) onlyVerifiedUser{
        Land storage land = lands[thandaperNumber];
        require(land.owner == msg.sender, "You are not the owner of this land");

        saleRequests[thandaperNumber] = SaleRequest({
            thandaperNumber: thandaperNumber,
            seller: msg.sender,
            buyer: buyer,
            sellerConfirmed: false,
            buyerConfirmed: false,
            registrarVerified: false,
            seniorRegistrarApproved: false
        });

        emit SaleRequested(thandaperNumber, msg.sender, buyer);
    }

    function confirmSaleBySeller(uint256 thandaperNumber) public notBlocked(msg.sender) onlyVerifiedUser {
        SaleRequest storage saleRequest = saleRequests[thandaperNumber];
        require(saleRequest.seller == msg.sender, "You are not the seller");
        saleRequest.sellerConfirmed = true;

        emit SaleConfirmedBySeller(thandaperNumber, msg.sender);
    }

    function confirmSaleByBuyer(uint256 thandaperNumber) public notBlocked(msg.sender) onlyVerifiedUser{
        SaleRequest storage saleRequest = saleRequests[thandaperNumber];
        require(saleRequest.buyer == msg.sender, "You are not the buyer");
        saleRequest.buyerConfirmed = true;

        emit SaleConfirmedByBuyer(thandaperNumber, msg.sender);
    }

    function verifySaleByRegistrar(
        uint256 thandaperNumber
    ) public onlyRole(Roles.SubRegistrar) {
        SaleRequest storage saleRequest = saleRequests[thandaperNumber];
        require(
            saleRequest.sellerConfirmed && saleRequest.buyerConfirmed,
            "Sale not confirmed by both parties"
        );
        saleRequest.registrarVerified = true;

        emit SaleVerifiedByRegistrar(thandaperNumber, msg.sender);
    }

    function approveSaleBySeniorRegistrar(
        uint256 thandaperNumber
    ) public onlyRole(Roles.SeniorRegistrar) {
        SaleRequest storage saleRequest = saleRequests[thandaperNumber];
        require(
            saleRequest.registrarVerified,
            "Sale not verified by registrar"
        );
        saleRequest.seniorRegistrarApproved = true;

        Land storage land = lands[thandaperNumber];
        land.owner = saleRequest.buyer;

        emit SaleApprovedBySeniorRegistrar(thandaperNumber, msg.sender);
    }

    // Death Transfer
    function initiateDeathTransfer(
        uint256 thandaperNumber,
        address beneficiary
    ) public onlyRole(Roles.SubRegistrar) landExists(thandaperNumber) notBlocked(msg.sender) onlyVerifiedUser{
        deathTransferRequests[thandaperNumber] = DeathTransferRequest({
            thandaperNumber: thandaperNumber,
            beneficiary: beneficiary,
            beneficiaryApproved: false,
            anonymousRegistrarApproved: false,
            seniorRegistrarApproved: false
        });

        emit DeathTransferInitiated(thandaperNumber, beneficiary);
    }

    function approveDeathTransferByBeneficiary(uint256 thandaperNumber) public {
        DeathTransferRequest storage request = deathTransferRequests[
            thandaperNumber
        ];
        require(
            request.beneficiary == msg.sender,
            "You are not the beneficiary"
        );
        request.beneficiaryApproved = true;

        emit DeathTransferApprovedByBeneficiary(thandaperNumber, msg.sender);
    }

    function approveDeathTransferByAnonymousRegistrar(
        uint256 thandaperNumber
    ) public onlyRole(Roles.SubRegistrar) {
        DeathTransferRequest storage request = deathTransferRequests[
            thandaperNumber
        ];
        require(request.beneficiaryApproved, "Beneficiary approval required");
        request.anonymousRegistrarApproved = true;

        emit DeathTransferApprovedByAnonymousRegistrar(thandaperNumber);
    }

    function finalizeDeathTransfer(
        uint256 thandaperNumber
    ) public onlyRole(Roles.SeniorRegistrar) {
        DeathTransferRequest storage request = deathTransferRequests[
            thandaperNumber
        ];
        require(
            request.anonymousRegistrarApproved,
            "Anonymous registrar approval required"
        );
        request.seniorRegistrarApproved = true;
        Land storage land = lands[thandaperNumber];
        land.owner = request.beneficiary;

        emit DeathTransferFinalized(thandaperNumber, request.beneficiary);
    }

    // Tax Payment
    function payTax(
        uint256 thandaperNumber,
        uint256 amount
    ) public isValidTaxAmount(thandaperNumber, amount) notBlocked(msg.sender) onlyVerifiedUser{
        Land storage land = lands[thandaperNumber];
        require(land.owner == msg.sender, "You are not the owner");

        // Tax payment logic
        emit TaxPaid(thandaperNumber, msg.sender, amount);
    }

    // Protected Land Type Change
    function requestProtectedLandTypeChange(
        uint256 thandaperNumber,
        LandType newLandType
    ) public onlyRole(Roles.Tahsildar) isProtected(thandaperNumber) {
        emit LandTypeChangeRequested(thandaperNumber, newLandType);
    }

    function approveProtectedLandTypeChange(
        uint256 thandaperNumber,
        LandType newLandType
    ) public onlyRole(Roles.Collector) {
        emit LandTypeChangeApproved(thandaperNumber, newLandType);
    }

    function finalizeProtectedLandTypeChange(
        uint256 thandaperNumber,
        LandType newLandType
    ) public onlyRole(Roles.ChiefSecretary) {
        Land storage land = lands[thandaperNumber];
        land.landType = newLandType;

        emit LandTypeChangeApproved(thandaperNumber, newLandType);
    }

    // Non-Protected Land Type Change
    function requestNonProtectedLandTypeChange(
        uint256 thandaperNumber,
        LandType newLandType
    ) public landExists(thandaperNumber) isNotProtected(thandaperNumber) notBlocked(msg.sender) onlyVerifiedUser{
        Land storage land = lands[thandaperNumber];
        require(land.owner == msg.sender, "You are not the owner of this land");
        emit LandTypeChangeRequested(thandaperNumber, newLandType);
    }

    function approveNonProtectedLandTypeChange(
        uint256 thandaperNumber,
        LandType newLandType
    ) public onlyRole(Roles.VillageOfficer) {
        Land storage land = lands[thandaperNumber];
        require(!land.protectedStatus, "Cannot change type of protected land");
        land.landType = newLandType;
        emit LandTypeChangeApproved(thandaperNumber, newLandType);
    }
}
