import twilio from 'twilio';

const accountSid = 'AC1731693e5c0a5b508c3acd53d7aa0647';
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = 'VA142822df58178fa17ad34cc41f4aab53';
export default twilio(accountSid, authToken).verify.v2.services(verifySid);
