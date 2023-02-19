import { app, h } from 'hyperapp';
import { Link } from '@hyperapp/router';
import './sidebar.css';

const Fragment = (props, children) => children;

const Profile = ({ profile, enterParticipant, inputProfile, isAdmin }) => {
  //console.log(profile);
  //console.log("---------------");
  const hasProfile = profile && profile.account != 0;
  //let newProfile = {};
  if (profile && !isAdmin ) {
    return hasProfile ? (
      <>
        <li class='nav-item px-3 mb-2'>
          <div>
            <small class='text-muted'>
              <b>Full name</b>
            </small>
          </div>
          <small>{profile.name}</small>
        </li>
        <li class='nav-item px-3 mb-2'>
          <div>
            <small class='text-muted'>
              <b>Email</b>
            </small>
          </div>
          <small>{profile.email}</small>
        </li>
        <li class='nav-item px-3 d-compact-none d-minimized-none mb-2'>
          <div>
            <small class='text-muted'>
              <b>No of performed sessions</b>
            </small>
          </div>
          <small>{profile.numSessionsPerformed} session(s)</small>
        </li>
        <li class='nav-item px-3 d-compact-none d-minimized-none mb-2'>
          <div>
            <small class='text-muted'>
              <b>Accuracy</b>
            </small>
          </div>
          <small>{profile.deviation}%</small>
        </li>
      </>
    ) : (
      <>
        <li class='nav-title'>Enter Participant Infor</li>
        <li class='nav-item px-3 mb-2'>
          <div>
            <small class='text-muted'>
              <b>Name</b>
            </small>
          </div>
          <input
            class='form-control form-control-sm'
            type='text'
            value={profile.name}
            oninput={e => {
              inputProfile({ field: 'name', value: e.target.value });
            }}
          ></input>
        </li>
        <li class='nav-item px-3 mb-2'>
          <div>
            <small class='text-muted'>
              <b>Email</b>
            </small>
          </div>
          <input
            class='form-control form-control-sm'
            type='email'
            value={profile.email}
            oninput={e => {
              inputProfile({ field: 'email', value: e.target.value });
            }}
          ></input>
        </li>
        <li class='nav-item px-3 mb-2'>
          <button
            class='btn  btn-sm btn-ghost-primary btn-block '
            type='button'
            onclick={enterParticipant}
          >
            Signup
          </button>
        </li>
      </>
    );
  }else if(isAdmin){
    return hasProfile ? (
      <>
         <li class='nav-item px-3 mb-2'>
          <div>
            <small class='text-muted'>
              <b>Full name</b>
            </small>
          </div>
          <small>{profile.name}</small>
        </li>
        <li class='nav-item px-3 mb-2'>
          <div>
            <small class='text-muted'>
              <b>Email</b>
            </small>
          </div>
          <small>{profile.email}</small>
        </li>
      </>
    ) : (
      <>
        <li class='nav-title'>Enter Admin Info</li>
        <li class='nav-item px-3 mb-2'>
          <div>
            <small class='text-muted'>
              <b>Full Name</b>
            </small>
          </div>
          <input
            class='form-control form-control-sm'
            type='text'
            value={profile.name}
            oninput={e => {
              inputProfile({ field: 'name', value: e.target.value });
            }}
          ></input>
        </li>
        <li class='nav-item px-3 mb-2'>
          <div>
            <small class='text-muted'>
              <b>Email</b>
            </small>
          </div>
          <input
            class='form-control form-control-sm'
            type='email'
            value={profile.email}
            oninput={e => {
              inputProfile({ field: 'email', value: e.target.value });
            }}
          ></input>
        </li>
        <li class='nav-item px-3 mb-2'>
          <button
            class='btn  btn-sm btn-ghost-primary btn-block '
            type='button'
            onclick={enterParticipant}
          >
            Signup
          </button>
        </li>
      </>
    );
  }
  
};

const UpdateUserInfo = ({profile, updateParticipantByAdmin, updateParticipantByUser, isAdmin }) =>{
  //const hasProfile = profile && profile.account != 0;
  // console.log("Hi");
  // console.log(profile);
  // console.log("Hi");
  // console.log(isAdmin);
  // console.log(hasProfile);
  if(isAdmin){
    return(
      <>
        <div>
        <li class='nav-title'>User Update by Admin</li>
        <li class='nav-item px-3 mb-2'>
          <div>
            <small class='text-muted'>
              <b>Account</b>
            </small>
          </div>
          <input
            class='update-user-admin '
            type='text'
            id='account'
            placeholder='Address'
          ></input>
        </li>
        <li class='nav-item px-3 mb-2'>
          <div>
            <small class='text-muted'>
              <b>Name</b>
            </small>
          </div>
          <input
            class='update-user-admin '
            type='text'
            id ='name'
            placeholder='Name'
          ></input>
        </li>
        <li class='nav-item px-3 mb-2'>
          <div>
            <small class='text-muted'>
              <b>Email</b>
            </small>
          </div>
          <input
            class='update-user-admin '
            type='email'
            id ='email'
            placeholder='Email'
          ></input>
        </li>
        <li class='nav-item px-3 mb-2'>
          <div>
            <small class='text-muted'>
              <b>Num Sessions Performed</b>
            </small>
          </div>
          <input
            class='update-user-admin'
            type='text'
            id ='numSessionsPerformed'
            placeholder='No Sessions'
          ></input>
        </li>
        <li class='nav-item px-3 mb-2'>
          <div>
            <small class='text-muted'>
              <b>Accuracy</b>
            </small>
          </div>
          <input
            class='update-user-admin '
            type='text'
            id ='deviation'
            placeholder='Deviation'
          ></input>
        </li>
        <li class='nav-item px-3 mb-2'>
          <button
            class='btn  btn-sm btn-ghost-primary btn-block '
            type='button'
            onclick={updateParticipantByAdmin}
          >
             Update
          </button>
        </li>
        </div>
        
      </>
    );
  }else{
    return(
      <>
        <div>
        <li class='nav-title'>User Information Update</li>
        <li class='nav-item px-3 mb-2'>
          <div>
            <small class='text-muted'>
              <b>Full Name</b>
            </small>
          </div>
          <input
            class='update-user-user '
            type='text'
            id ='_name'
            placeholder='Full name'
          ></input>
        </li>
        <li class='nav-item px-3 mb-2'>
          <div>
            <small class='text-muted'>
              <b>Email</b>
            </small>
          </div>
          <input
            class='update-user-user '
            type='email'
            id ='_email'
            placeholder='Email'
          ></input>
        </li>
        <li class='nav-item px-3 mb-2'>
          <button
            class='btn  btn-sm btn-ghost-primary btn-block '
            type='button'
            onclick={updateParticipantByUser}
          >
            Update 
          </button>
        </li>
        </div>
        
      </>
    );
  }
  
};

const Account = ({ account, balance, isAdmin }) => {
   //console.log(isAdmin);
  // console.log(account);
  //console.log(balance);
  return account ? (
    <div class='sidebar-header'>
      <img
        class='img-avatar img-thumbnail'
        src={'https://robohash.org/' + account}
      ></img>
      <div class='balance'>{balance / 1000000000000000000} ETH</div>
      {isAdmin ? (
        <h4>
          <span class='badge badge-pill badge-primary'>Administrator</span>
        </h4>
      ) : (
        <h4>
          <span class='badge badge-pill badge-secondary'>Member</span>
        </h4>
      )}
      <div class='account'>{account}</div>
    </div>
  ) : (
    <div></div>
  );
};

const Sidebar = ({
  account,
  balance,
  isAdmin,
  profile,
  enterParticipant,
  inputProfile,
  updateParticipantByAdmin,
  updateParticipantByUser
}) => {
  return (
    <div class='sidebar'>
      <Account
        account={account}
        balance={balance}
        isAdmin={isAdmin}
        profile={profile}
      ></Account>
      <nav class='sidebar-nav'>
        <ul class='nav'>
          <Profile
            profile={profile}
            enterParticipant={enterParticipant}
            inputProfile={inputProfile}
            isAdmin ={isAdmin}
          ></Profile>
          
          <li class='nav-divider'></li>
          <li class='nav-title'>View all</li>
          <li class='nav-item'>
            <Link class='nav-link' to='/products'>
              <i class='nav-icon cui-balance-scale'></i> Products
            </Link>
          </li>
          <li class='nav-item'>
            <Link class='nav-link' to='/participants'>
              <i class='nav-icon cui-people'></i> Participants
            </Link>
          </li>
          <li class='nav-divider'></li>
        
          <UpdateUserInfo
            profile={profile}
            inputProfile={inputProfile}
            isAdmin ={isAdmin}
            updateParticipantByAdmin={updateParticipantByAdmin}
            updateParticipantByUser={updateParticipantByUser}
          ></UpdateUserInfo>
        </ul>
      </nav>
    </div>
  );
};

export { Sidebar };
