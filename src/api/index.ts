import axios from 'axios';

interface TicketData {
  selectedNumbers: {
    firstField: number[];
    secondField: number[];
  };

  isTicketWon: boolean;
}

export const sendTicket = async (data: TicketData) => {
  let reqCount = 0;

  const successCondition = (status: number) => {
    return String(status).startsWith('2');
  };

  const request = () => {
    return axios.post('https://jsonplaceholder.typicode.com/posts', data);
  };

  return new Promise(async (res) => {
    try {
      const resp = await request();
      if (successCondition(resp.status)) {
        res(true);
      } else {
        throw new Error();
      }
    } catch (error) {
      const interval = setInterval(async () => {
        reqCount += 1;
        if (reqCount >= 2) {
          clearInterval(interval);
          res(false);
        }
        const resp = await request();
        if (successCondition(resp.status)) {
          clearInterval(interval);
          res(true);
        }
      }, 2000);
    }
  });
};
