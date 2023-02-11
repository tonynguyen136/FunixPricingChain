import { app, h } from 'hyperapp';
import './participants.css';

const ParticipantRow = participant => (
  <tr class='participant'>
    <td scope='row' class='text-center'>
      <img
        class='img-avatar img-thumbnail'
        src={'https://robohash.org/' + participant.account}
      ></img>
    </td>
    <td scope='row' class='align-middle'>
      {participant.name}
      
    </td>
    <td scope='row' class='align-middle'>
      {participant.email}
    </td>
    <td scope='row' class='align-middle text-center'>
      {participant.numSessionsPerformed}
    </td>
    <td scope='row' class='align-middle text-center'>
      {participant.deviation / 100} %
    </td>
    <td scope='row' class='align-middle text-center'>
      <code>{participant.account}</code>
    </td>
  </tr>
);
const Participants = ({ match }) => ({ participants }) => (
  <div class='d-flex w-100 h-100 bg-white'>
    <div class='products-list'>
      <table class='table table-hover table-striped'>
        <thead>
          <tr>
            <th scope='col' class='text-center'></th>
            <th scope='col'>Fullname</th>
            <th scope='col'>Email</th>
            <th scope='col' class='text-center'>
              Number of sessions
            </th>
            <th scope='col' class='text-center'>
              Deviation
            </th>
            <th scope='col' class='text-center'>
              Address
            </th>
          </tr>
        </thead>
        <tbody>
         
          {(participants || []).map((p, i) => {
            p.no = i + 1;
            //console.log(p);
            return ParticipantRow(p);
            // return (
            //   <ParticipantRow
            //     participant = {p}
            //   ></ParticipantRow>
            // );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

export { Participants };

    // <div class='p-2 flex product-detail'>
         
    // </div>
