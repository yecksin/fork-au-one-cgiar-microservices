import axios from 'axios';
import * as dotenv from 'dotenv';
import { decode } from '../utils/decodeToken';
import logger from '../classes/logs';
dotenv.config();

let token: string = '';
export let appSecretData: any = {};
const authBody = {
  login: process.env.CLARISA_LOGIN,
  password: process.env.CLARISA_PASSWORD
};

interface ErrorInfo {
  message: string;
  stack: string;
}

export const getToken = async () => {
  const endpoint = `${process.env.CLARISA_HOST}auth/login`;
  if (!token || !validToken(token)) {
    try {
      const response = await axios.post(endpoint, authBody);
      token = response.data.access_token;
    } catch (error) {
      const { message, stack } = error as ErrorInfo;
      logger.error(`Error : ${error}`, { message, stack, endpoint });
    }
  }
  return token;
};

export const validToken = (token: string): boolean => {
  const decoded = decode(token);
  const now = Math.floor(Date.now() / 1000);
  if (decoded && typeof decoded === 'object' && 'exp' in decoded) {
    if (decoded.exp > now) return true;
  }
  return false;
};

export const validateAppSecret = async () => {
  const endpoint = `${process.env.CLARISA_HOST}api/app-secrets/validate`;
  return new Promise(async resolve => {
    await axios
      .post(
        endpoint,
        {
          client_id: process.env.CLIENT_ID,
          secret: process.env.SECRET
        },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`
          }
        }
      )
      .then(res => {
        appSecretData = res.data;
        resolve(true);
      })
      .catch(error => {
        const { message, stack } = error as ErrorInfo;
        logger.error(`Error : ${error}`, { message, stack, endpoint });
        resolve(false);
      });
  });
};

export const getMonitorTestLinks = async () => {
  const endpoint = `${process.env.CLARISA_HOST}api/monitor-test-links`;
  try {
    return await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${await getToken()}`
      }
    });
  } catch (error) {
    const { message, stack } = error as ErrorInfo;
    logger.error(`Error : ${error}`, { message, stack, endpoint });
  }
};
