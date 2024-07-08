import axios from 'axios';

interface TicketData {
  selectedNumbers: {
    firstField: number[];
    secondField: number[];
  };

  isTicketWon: boolean;
}

export const sendTicket = async (data: TicketData) => {
  let success = false;
  for (let i = 0; i < 3; i++) {
    let resp;
    try {
      resp = await axios.post('https://jsonplaceholder.typicode.com/posts', data);
    } catch (error) {
      continue;
    }

    if (String(resp.status).startsWith('2')) {
      success = true;
      break;
    }
  }
  return success;
};
