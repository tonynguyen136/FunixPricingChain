// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "./Session.sol";

contract Main is IMain{

    // Structure to hold details of participants
    struct IParticipant {
        address account; // address of participiant
        string name;     // name of participant
        string email;    // email of participant
        uint256 numSessionsPerformed; // number of sessionns that a participant performed
        uint256 deviation;   // deviation of participant (%)
    }
    mapping(address => IParticipant) public participantDetails; //  Mapping to participant's information
    address [] public participantAddr; // a list of address of all participants

    address public admin; // address of administrator of the contract
    address [] public deployedSessions; // a list of addresses of sessions deployed
    uint256 public totalSessions; // number of sessions deployed
    uint256 public totalParticipants; // number of participants

    /**
     * @dev admin varible will be assigned to the deployer of the main contract
     */
    constructor() {
        admin = msg.sender;
    }
    /**
     * @dev a modifier onlyAdmin is created for admin only
     */
    modifier onlyAdmin{
        require(msg.sender == admin);
        _;
    }

    /**
     * @dev add a session contract address to main contract and Increase number of session deployed. 
     * @param session will be stored to the deployedSession array
     */
    function addSession(address session) public {
        require(tx.origin == admin, "Only admin can add a session!");
        deployedSessions.push(session);
        totalSessions++; 
    }

    /**
     * @dev a user is able to enter the participant's information
     * Requiremnts: Participant's name and participant's email
     * User Information's update
     */
    function enterParticipant(string memory _name, string  memory _email) public{
        // check if account is not yet entered
        require(
                bytes(participantDetails[msg.sender].name).length == 0
                && bytes(participantDetails[msg.sender].email).length ==0 ,
                "Account is already entered, go to update info if needed"
        );
        IParticipant storage participant = participantDetails[msg.sender];
        participant .account = msg.sender;
        participant.name = _name;
        participant.email = _email;
        //totalParticipants++; // total of participants increase 1 when signup successful
        participantAddr.push(msg.sender); // save participant address to a list
    }
    /**
     * @dev update participants infomation -  admin role
     */
    function updateParticipantByAdmin(
        address _account,
        string memory _name,
        string memory _email,
        uint256 _numSessionsPerformed,
        uint256 _deviation
    ) public onlyAdmin{
        IParticipant storage participant = participantDetails[_account];
        require(participant.account == _account, "Entered account does not exist!!!");
        participant.name = _name;
        participant.email = _email;
        participant.numSessionsPerformed = _numSessionsPerformed;
        participant.deviation = _deviation;
    }
    /**
     * @dev update participants infomation - user role
     * requirememts: name and email
     */
     function updateParticipantByUser(string memory _name, string  memory _email) public{
        IParticipant storage participant = participantDetails[msg.sender];
        require(participant.account == msg.sender, "Entered account does not exist!!!");
        participant.name = _name;
        participant.email = _email;
    }

     /**
     * @dev Update the deviation from the participant who has joined pricing sessions
     */
    function updateDeviation(address _participantAddr, uint256 _newDeviation) public{
        require(tx.origin == admin, "Only admin can add a session!");
        IParticipant storage participant = participantDetails[_participantAddr];
        // save numSessionsPerformed of each participant to local variable
        participant.numSessionsPerformed ++;
        uint256 paticipantNumSessionsPerformed = participant.numSessionsPerformed;
        participant.deviation = (participant.deviation*paticipantNumSessionsPerformed + _newDeviation)
        /(paticipantNumSessionsPerformed + 1);   
    }

    /**
     * @dev admin allows to get participant information
     * @param _participant address of participant as an input for the details
     * including: account, name, email, number of session performed, deviation
     */
    function getAParticipant(address _participant) 
    public view onlyAdmin returns(address, string memory, string memory, uint256, uint256){
        return(
            participantDetails[_participant].account,
            participantDetails[_participant].name,
            participantDetails[_participant].email,
            participantDetails[_participant].numSessionsPerformed,
            participantDetails[_participant].deviation
        );
    }

    /**
     * @dev get admin address for the session contract
     */
    function getAdmin() public view returns(address){
        return admin;
    }
    

}
