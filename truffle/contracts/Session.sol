// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Interface of Main contract to call from Session contract
interface IMain {
    function addSession(address session) external;
    function enterParticipant(string memory _name, string  memory _email) external;
    function updateParticipantByAdmin(
        address _account,
        string memory _name,
        string memory _email,
        uint256 _numSessionsPerformed,
        uint256 _deviation
    ) external;
    function updateParticipantByUser(string memory _name, string  memory _email) external;
    function updateDeviation(address _participantAddr, uint256 _newDeviation) external;
    function getAParticipant(address _participant) 
    external view returns(address, string memory, string memory, uint256, uint256);
    function getAdmin() external view returns(address);

}

contract Session {
    /**
     * Main contract address to add to a new session 
     * An instance from main contract
     */
    address public mainContract;
    IMain MainContract;
    address public admin; // to save an admin address from the main contract

    string public productName; // Product name
    string public productDescription; // Product description
    string public productImages; // specific image.

    uint256 public proposedPrice; // the price is proposed based on all given price and their's deviation
    uint256 public finalPrice; // when the session is ended, the final price is up to date

    // struct of participants who joined to the pricing session 
    struct IsessionParticipant{
        address participantAddress; // address of participant who joined to the session
        uint256 participantPrice;   // a given price from a participant
        uint256 newDeviation;          // deviation of a participant
        bool registered;                // a status of the participants registered or not
        bool sessionJoined;          // a status of the participant who joined to price a product
        uint8 participantID;        // Participant ID of the session
    }
    mapping(address => IsessionParticipant) public sessionParticipantsDetails;
    IsessionParticipant [10] public sessionParticipants; // a list of participants of the session
    
    uint8 public participantCount = 0; // counter of participants 
    uint8 public joinedParticipantCount = 0; // counter of participant who has joined
    
    // State of the pricing session 
    enum State {INITIATED, CREATED, STARTED, CLOSING, CLOSED}
    State public state = State.INITIATED; // Initiated state for a session
    
    uint256 public timeout; // timeout for a pricing session

    constructor(
        address _mainContract,
        string memory _productName,
        string memory _productDescription,
        string memory _productImages
    ){
        // Get Main Contract instance
        mainContract = _mainContract;
        MainContract = IMain(_mainContract);

        // admin address from main contract
        admin = MainContract.getAdmin();
        
        // Init Session contract with the product information
        productName = _productName;
        productDescription = _productDescription;
        productImages = _productImages;
        // state of the session change to CREATED
        state = State.CREATED;
        
        // Init a timer to pricing session

        timeout = block.timestamp + 1 days;

        // Call Main Contract function to link current contract.
        MainContract.addSession(address(this));
    }
    /**
     * @dev a modifier to check the current state of a session 
     */
    modifier stateCheck(State currentState){
        require(state == currentState);
        _;
    }
    /**
     * @dev a modifier: Admin only
     */
    modifier onlyAdmin{
        require(msg.sender == admin);
        _;
    }
    // TODO: Functions
    /**
     * @dev Update production information before the session begins
     * @param _productName: change the product name if any
     * @param _productDescription: change the product description if any
     * @param _productImages Change the list of images if any
     */
    function updateProductInfo(
        string memory _productName,
        string memory _productDescription,
        string  memory _productImages
    ) public onlyAdmin stateCheck(State.CREATED){
        productName = _productName;
        productDescription = _productDescription;
        productImages = _productImages;
    }
    
    /**
     * @dev register participants to join a pricing session
     * Participants are less than 10 people
     */
    function register(address _participant) public onlyAdmin stateCheck(State.CREATED){
        // require(
        //     sessionParticipants[participantCount].registered == false,
        //     "Account has been registered!" 
        // );
        require(
            sessionParticipantsDetails[_participant].registered == false,
            "Account has been registered!" 
        );
        require(
            _participant != address(0),
            "Zero account can not joined!" 
        );
        sessionParticipants[participantCount].participantAddress = _participant;
        sessionParticipants[participantCount].registered = true;
        sessionParticipants[participantCount].participantID = participantCount;
        sessionParticipantsDetails[_participant] = sessionParticipants[participantCount];
        participantCount++;

    }

    /**
     * @dev Only Admin can be able to start a pricing session
     */
    function startPricingSession() public onlyAdmin stateCheck(State.CREATED){
        // the state allows participants start to price
        state = State.STARTED; 

    }
    /**
     * @dev participants are able to start to price a product
     * @param _price is a given price that a participant prices
     * The participants can price a product many time during the session started. 
     */
    function priceProduct(uint256 _price) public stateCheck(State.STARTED){
        require(msg.sender != admin,"Admin should not join to price a product");
        require(
            sessionParticipantsDetails[msg.sender].registered == true, 
            "Only the participants who registered by admin can price a product!" 
        );
        if(sessionParticipantsDetails[msg.sender].sessionJoined == false){
            joinedParticipantCount++; // increase 1 time for one address for the 1st time// 2nd times not count
        }
        sessionParticipantsDetails[msg.sender].participantPrice = _price;
        sessionParticipantsDetails[msg.sender].sessionJoined = true;
        // Update the same to sessionParticipants array (from sessionParticipantsDetails[msg.sender])
        sessionParticipants[sessionParticipantsDetails[msg.sender].participantID].participantPrice = _price;
        sessionParticipants[sessionParticipantsDetails[msg.sender].participantID].sessionJoined = true;
        if(block.timestamp > timeout){
            state = State.CLOSING;
        }
    }
    /**
     * @dev close a pricing session by admin 
     * Update the state of the pricing session 
     */
    function closePricingSession() public onlyAdmin stateCheck(State.STARTED){
        state = State.CLOSING;
    }


    /**
     * @dev calculate the proposed price for the session
     * change the state from CLOSING TO CLOSED for calculating
     */
    function calculateProposedPrice() public onlyAdmin stateCheck(State.CLOSING){
        uint256 totalDeviation;
        uint256 totalPrice;
        uint256 totalMultiple;
        uint256 totalParticipant;
        for(uint i =0; i < participantCount; i++){
            if(sessionParticipants[i].sessionJoined){
                totalPrice += sessionParticipants[i].participantPrice;
                totalDeviation += sessionParticipants[i].newDeviation;
                totalMultiple += sessionParticipants[i].participantPrice*sessionParticipants[i].newDeviation;
                totalParticipant++;
            }
        }
        proposedPrice = (100*totalPrice - totalMultiple)/(100*totalParticipant - totalDeviation);
        state = State.CLOSED; // state is closed when finishing the proposed price calculated
    }
    
    /**
     * @dev calculate the deviation of a participant based on final price and proposed price
     * @param _finalPrice set a final price based on final Price and update deviation
     * Set a final price
     */
    function calculateDeviation(uint256 _finalPrice) public onlyAdmin stateCheck(State.CLOSED){
        finalPrice = _finalPrice; // update final price
        for(uint i =0; i < participantCount; i++){
            if(sessionParticipants[i].sessionJoined){
                if(finalPrice >= sessionParticipants[i].participantPrice){
                    sessionParticipants[i].newDeviation = 100*(finalPrice - sessionParticipants[i].participantPrice)/finalPrice;
                }else{
                    sessionParticipants[i].newDeviation = 100*(sessionParticipants[i].participantPrice - finalPrice)/finalPrice;
                }
            }
        }
        // Update deviation to the main contract
        for(uint i =0; i < participantCount; i++){
            if(sessionParticipants[i].sessionJoined){
                MainContract.updateDeviation(
                    sessionParticipants[i].participantAddress,
                    sessionParticipants[i].newDeviation
                );
            }
        }
    }
    
    /**
      * @dev get Participant information from the pricing session
      * @param index to check a specific partipant has priced
      */
    function getSessionParticipant(uint index) public view 
    returns(address, uint256, uint256 ){
        IsessionParticipant storage participant = sessionParticipants[index];
        return(
            participant.participantAddress,
            participant.participantPrice,
            participant.newDeviation
        );
    }

    /**
     * @dev get the product information
     */
    function getProductInfo() public view returns(string memory, string memory, string memory){
        return(
            productName,
            productDescription,
            productImages
        );
    }


}
