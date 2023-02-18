import { app, h } from 'hyperapp';
import { Link, Route, location } from '@hyperapp/router';
import { Products } from './pages/products';
import { Sidebar } from './pages/sidebar';
import { Participants } from './pages/participants';
import { config } from './config';
import { promisify } from 'util';
import './css/vendor/bootstrap.css';
import './css/vendor/coreui.css';
import './css/index.css';


const Fragment = (props, children) => children;

const Web3 = require('web3');
let web3js;

// if (typeof Web3 !== 'undefined') {
//   web3js = new Web3(Web3.currentProvider);
//   console.log(web3js.eth.getAccounts());
// } else {
//   //web3js = new Web3('ws://localhost:7545');
// }


if (typeof window.ethereum !== 'undefined') {
    // Use the latest version of the provider
    const provider = window.ethereum;
    // Request account access
    provider.enable().then(() => {
    // Use the provider to create a web3.js instance
    web3js = new Web3(provider);
    //web3js = new Web3(Web3.currentProvider);
    // reload account
    window.ethereum.on('accountsChanged', function (accounts) {
      window.location.reload();
    });
    // You can now interact with the Ethereum network
    console.log(web3js.eth.getAccounts());
    FunixPricingChain();

  });
} else {
  console.error('Please install MetaMask!!!');
}

import Main from './contracts/Main.json';
import Session from './contracts/Session.json';
//import { profile } from 'console';
function FunixPricingChain(){
    const mainContract = new web3js.eth.Contract(Main.abi, config.mainContract);
    console.log(mainContract);
    // Init state
    var state = {
      count: 1,
      location: location.state,
      products: [],
      dapp: {},
      balance: 0,
      account: 0,
      admin: false,
      profile: null,
      fullname: '',
      email: ''.replace,
      newProduct: {},
      sessions: [],
      currentProductIndex: 0,
      participants: []
    };
    
    // Functions of Main Contract
    const contractFunctions = {
      getAccounts: promisify(web3js.eth.getAccounts),
      getBalance: promisify(web3js.eth.getBalance),

      // TODO: The methods' name is for referenced. Update to match with your Main contract

      // Get Admin address of Main contract
      getAdmin: mainContract.methods.admin().call,

      // Get participant by address
      participants: address => mainContract.methods.participantDetails(address).call,

      // Get number of participants
      nParticipants: mainContract.methods.totalParticipants().call,

      // Get address of participant by index (use to loop through the list of participants) 
      iParticipants: index => mainContract.methods.participantAddr(index).call,
      // enter new participant
      enterParticipant: (name, email) =>
        mainContract.methods.enterParticipant(name, email).send,
      
      // Get number of sessions  
      nSessions: mainContract.methods.totalSessions().call,

      // Get address of session by index (use to loop through the list of sessions) 
      sessions: index => mainContract.methods.deployedSessions(index).call,

      // Update user information by Admin
      updateParticipantByAdmin: (_account, _name, _email,_numSessionsPerformed,_deviation ) =>
        mainContract.methods.updateParticipantByAdmin(_account, _name, _email,_numSessionsPerformed,_deviation).send,
      // Update user information by User
      updateParticipantByUser: (_name, _email) =>
        mainContract.methods.updateParticipantByUser(_name, _email).send
    };

    const actions = {
      inputProfile: ({ field, value }) => state => {
        let profile = state.profile || {};
        profile[field] = value;
        return {
          ...state,
          profile
        };
      },

      inputNewProduct: ({ field, value }) => state => {
        let newProduct = state.newProduct || {};
        newProduct[field] = value;
        return {
          ...state,
          newProduct
        };
      },

      createNewSession: () => async (state, actions) => {
        let contract = new web3js.eth.Contract(Session.abi, {
          data: Session.bytecode
        });
        await contract
          .deploy({
            arguments: [
              // TODO: Argurment when Deploy the Session Contract
              // It must be matched with Session.sol Contract Constructor
              // Hint: You can get data from `state`
              config.mainContract,
              state.newProduct.productName,
              state.newProduct.productDescription,
              state.newProduct.productImages
            ]
          })
          .send({ from: state.account });
        console.log(state.newProduct.productName);
        console.log(state.newProduct);
        //console.log(actions.getSessions());
        actions.getSessions();
        
      },

      selectProduct: i => state => {
        return {
          currentProductIndex: i
        };
      },

      sessionFn: ({action, data}) =>async (state, actions) => {
      
        // get session contract from state: sessions (contract)
        let sessionContract = state.sessions[state.currentProductIndex].contract;
        //console.log(sessionContract);
        // get state sesion from Session contract - at the beginning: INITIATED: stateSession = 1
        let stateSession = await sessionContract.methods.state().call();
        //alert(`Ben ngoai" + ${data}` + data);
        // get number of participants who registered;
        //let noRegisteredParticipants = await sessionContract.methods.participantCount().call();
        switch (action) {
          case 'Register Participants': 
              // Handle event when Admin registers participants to join this session
              if(stateSession == 1){
                alert("Checking" + stateSession + data);
                await sessionContract.methods.register(data).send({from: state.account});
                alert(data + " address is registered successfully!!!");
                actions.getSessions();
                //alert("Address joined!!!" + data);
              }else if(stateSession ==2){
                alert("Can't not register in STARTED state");
              }else if(stateSession == 3){
                alert("Can't not register in CLOSING state");
              }else{
                alert("Can't not register in CLOSED state");
              }
              break;
          case 'Start a pricing session':
              //TODO: Handle event when starting a pricing sesssion
              if(stateSession == 1){
                await sessionContract.methods.startPricingSession().send({from: state.account});
                alert("Session is starting to price!");
                actions.getSessions();
              } else if(stateSession ==2){
                alert("Can't not start a session in STARTED state");
              } else if(stateSession ==3){
                alert("Can't not start a session in CLOSING state");
              }else{
                alert("Can't not start a session in CLOSED state");
              }
              break;
          case 'Price a Product':
              //TODO: Stop allowing a user prices a product
              // Admin calculated prosed price 
              //The inputed Price is stored in `data`
              if(stateSession == 1){
                alert("Can't not price a product in CREATED state");
              } else if(stateSession ==2){
                try{
                  await sessionContract.methods.priceProduct(data).send({from: state.account});
                  actions.getSessions();
                  alert("Price a producet successfully!");
                }catch(err){
                  alert("Account was not registered to this session, please try later!")
                }
                
              } else if(stateSession ==3){
                alert("Can't not price a product in CLOSING state");
              }else{
                alert("Can't not price a product in CLOSED state");
              }
              break;
          case 'Closing session':
              //TODO: Handle event when User Close a session
              
              if(stateSession ==1){
                alert("Can't not closing a session in CREATED state");
              }else if(stateSession == 2){
                //alert("Closing");
                await sessionContract.methods.closePricingSession().send({from: state.account});
                alert("Session is closing to price!");
                actions.getSessions();
              }else if(stateSession ==3){
                alert("Can't not closing a session in CLOSING state");
              } else{
                alert("Can't not closing a session in CLOSED state");
              }

              break;
          case 'Close and Calculate Proposed Price':
              //TODO: Handle event when Admin closes a pricing session and Calculate proposed price
              //The inputed Price is stored in `data`
              if(stateSession ==1){
                alert("Can't not close a session in CREATED state");
              }else if(stateSession == 2){
                //alert("Closing");
                alert("Can't not close a session in STARTED state");
              }else if(stateSession ==3){
                try{
                  await sessionContract.methods.calculateProposedPrice().send({from: state.account});
                  alert("Session closed and Calculation finished!");
                  actions.getSessions();
                }catch(err){
                  alert("There are no participants who joined to this session!")
                }
               
              } else{
                alert("Can't not close a session in CLOSED state");
              }
              break;
          case 'Set a final price and Update deviation':
                //TODO: Handle event when Admin closes a pricing session and Calculate proposed price
                //The inputed Price is stored in `data`
                if(stateSession ==1){
                  alert("Can't not set a final price in CREATED state");
                }else if(stateSession == 2){
                  alert("Can't not set a final price in STARTED state");
                }else if(stateSession ==3){
                  alert("Can't not set a final price in CLOSING state");
                } else{
                  await sessionContract.methods.calculateDeviation(data).send({from: state.account});
                  alert("Set a final price and Update deviation of participants succefully!")
                  actions.getSessions();
                  actions.getParticipants();
                }
                break;
        }
      },

      location: location.actions,

      getAccount: () => async (state, actions) => {
        // a list accounts
        let accounts = await contractFunctions.getAccounts();
        // balance of accounts[0]
        let balance = await contractFunctions.getBalance(accounts[0]);
        // address of admin
        let admin = await contractFunctions.getAdmin();
        //console.log(admin);
        // profile of admin
        let profile = await contractFunctions.participants(accounts[0])();

        actions.setAccount({
          account: accounts[0],
          balance,
          isAdmin: admin === accounts[0],
          profile
        });
      },
      // set accounts
      setAccount: ({ account, balance, isAdmin, profile }) => state => {
        return {
          ...state,
          account: account,
          balance: balance,
          isAdmin: isAdmin,
          profile
        };
      },

      getParticipants: () => async (state, actions) => {
        let participants = [];
        let nParticipant = await contractFunctions.nParticipants();
        console.log("=====");
        console.log("No of participants:" + nParticipant);
        // TODO: Load all participants from Main contract.
        for(let index = 0; index < nParticipant; index++){
          //
          // Get participant address
          let participantAddress = await contractFunctions.iParticipants(index)();
          console.log('===================');
          console.log(participantAddress);
          console.log(state.account);
          console.log("1111");
          console.log(state);
          console.log('===================');
          // admin can view all and current account only view their own account
          if(state.isAdmin || state.account === participantAddress){
            let participant = await contractFunctions.participants(participantAddress)();
            console.log(participant);
            participants.push(participant);
          }
            
        }

        // One participant should contain { address, fullname, email, nSession and deviation }
        console.log("=============");
        console.log(participants);

        actions.setParticipants(participants);
      },

      setParticipants: participants => state => {
        return {
          ...state,
          participants: participants
        };
      },

      setProfile: profile => state => {
        return {
          ...state,
          profile: profile
        };
      },

      // Enter a new participant information
      enterParticipant: () => async (state, actions) => {
        // TODO: Register new participant
        // access pro profile['name] value
        let name = state.profile['name'];
        let email = state.profile['email'];
        // enter new participant informaiton from main contract
        await contractFunctions.enterParticipant(name,email)({from: state.account});
        // return detail of participant
        const profile = await contractFunctions.participants(state.account)();
        // console.log(state.account);
        // // access to profile['name] = value
        // // profile insides state
        // console.log(profile.name);
        
        actions.setProfile(profile);
        actions.getParticipants();
      },
      
      // Update participants by admin
      updateParticipantByAdmin: () => async (state, actions) =>{
        // Update User Information
        let account = document.getElementById('account').value;
        let name = document.getElementById('name').value;
        let email = document.getElementById('email').value;
        let numSessionsPerformed = document.getElementById('numSessionsPerformed').value;
        let deviation = document.getElementById('deviation').value;
        console.log("account" +  account);
        console.log("name" +  name);
        console.log("email" +  email);
        console.log("numSessionsPerformed" +  numSessionsPerformed);
        console.log("deviation" +  deviation);
        try{

        //update participants infomation -  admin role
          await contractFunctions.updateParticipantByAdmin(
            account, name, email, numSessionsPerformed, deviation
            )({from: state.account});
             // Update profile of user - account
          const profile = await contractFunctions.participants(account)();
          console.log(state.account);
          //actions.setProfile(profile);
          //actions.getAccount();
        }catch(err){
          alert("Account does not exits for updating. Please correct it!");
        }
       
        // clear input field
        document.getElementById('account').value = '';
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('numSessionsPerformed').value = '';
        document.getElementById('deviation').value = '';
        actions.getParticipants();
        
      },

      // Update participnats by User
      updateParticipantByUser: () => async (state, actions) =>{
            // Update User Information
        let name = document.getElementById('_name').value;
        let email = document.getElementById('_email').value;
        //update participants infomation -  user
        await contractFunctions.updateParticipantByUser(name, email)({from: state.account});
        // Update profile of user - account
        const profile = await contractFunctions.participants(state.account)();
        actions.setProfile(profile);
        // clear input
        document.getElementById('_name').value = '';
        document.getElementById('_email').value = '';
        actions.getParticipants();
      },
      // Get sessions
      getSessions: () => async (state, actions) => {
        // TODO: Get the number of Sessions stored in Main contract
        let nSession = await contractFunctions.nSessions();
        let sessions = [];
        // TODO: And loop through all sessions to get information
        for (let index = 0; index < nSession; index++) {
          // Get session address
          let session = await contractFunctions.sessions(index)();
          // Load the session contract on network
          let contract = new web3js.eth.Contract(Session.abi, session);
          console.log(contract);
          // address of session 
          let id = session;

          // TODO: Load information of session.
          // Hint: - Call methods of Session contract to reveal all nessesary information
          //       - Use `await` to wait the response of contract

          let productName = await contract.methods.productName().call(); // TODO
          let productDescription = await contract.methods.productDescription().call(); // TODO
          let productImages = await contract.methods.productImages().call(); // TODO
          let finalPrice = await contract.methods.finalPrice().call(); // TODO
          
          let status = "Initiated"; // at the beginning - contract is not deployed yet
          // get state of Session from Session contract
          let stateSession = await contract.methods.state().call();
          console.log("stateSession = " +stateSession);

          switch(stateSession){
            case "1":
              status = "Created";
              break;
            case "2":
              status = "Started";
              break;
            case "3":
              status = "Closing";
              break;
            case "4":
              status = "Closed";
              break;
          }
          // admin can view all and non-admin only can view Closed and Started
          if(state.isAdmin || stateSession == 2 || stateSession ==3 || stateSession ==4){
            
              // get number of participants who registered;
            let noRegisteredParticipants = await contract.methods.participantCount().call();
            // get number of participnats who has priced a product - joinedParticipantCount
            let noPricedParticipants = await contract.methods.joinedParticipantCount().call();
            // get proposed price after finishing the session
            let proposedPrice = await contract.methods.proposedPrice().call();
            // get state of Session from Session contract
            let _finalPrice = await contract.methods.finalPrice().call();
            sessions.push({ id, productName, productDescription, finalPrice, contract, productImages,status,noRegisteredParticipants,noPricedParticipants,proposedPrice,_finalPrice });
          }
          
        }
        actions.setSessions(sessions);
      },

      setSessions: sessions => state => {
        return {
          ...state,
          sessions: sessions
        };
      }
    };

    const view = (
      state,
      { getAccount, getParticipants, enterParticipant, inputProfile, getSessions, updateParticipantByAdmin, updateParticipantByUser }
    ) => {
      return (
        <body
          class='app sidebar-show sidebar-fixed'
          oncreate={() => {
            getAccount().then(function(){
              getParticipants();
              
            }).then(function(){
              getSessions();
            });
            
            
          }}
        >
          <div class='app-body'>
          <Sidebar
              balance={state.balance}
              account={state.account}
              isAdmin={state.isAdmin}
              profile={state.profile}
              enterParticipant={enterParticipant}
              inputProfile={inputProfile}
              updateParticipantByAdmin ={updateParticipantByAdmin}
              updateParticipantByUser ={updateParticipantByUser}
            ></Sidebar>
            <main class='main d-flex p-3'>
              <div class='h-100  w-100'>
                <Route path='/products' render={Products}></Route>
                <Route path='/participants' render={Participants}></Route>
              </div>
            </main>
          </div>
        </body>
      );
    };
    const el = document.body;

    const main = app(state, actions, view, el);
    const unsubscribe = location.subscribe(main.location);

}







