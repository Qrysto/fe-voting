import twilio from 'twilio';

const accountSid = 'AC1731693e5c0a5b508c3acd53d7aa0647';
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = 'VA142822df58178fa17ad34cc41f4aab53';
const client = twilio(accountSid, authToken);

export const verifyService = client.verify.v2.services(verifySid);

export const lookup = client.lookups.v2;
