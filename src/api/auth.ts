import {ResponseType} from '@ngevent/types/propTypes';
import {KEY_USER} from '@ngevent/utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import server from './server';

export type UserData = {
  id: number;
  email: string;
  username: string;
  fullname: string;
  avatar: string;
  role: string;
  token: string;
  favorite_id: number | null;
  created_at: string;
  updated_at: string;
};

export type LoginInput = {
  username: string;
  password: string;
};

type ResponseLogin = ResponseType<UserData>;
export async function sendLogin(dataInput: LoginInput): Promise<ResponseLogin> {
  const {data} = await server.post<ResponseLogin>('auth/login', dataInput);

  if (data.success) {
    await AsyncStorage.setItem(KEY_USER, JSON.stringify(data.data));
    return data;
  }
  throw new Error(data.message || 'Some error occured');
}

export type RegisterInput = {
  username: string;
  email: string;
  password: string;
  fullname: string;
  role: string;
};

type ResponseRegister = ResponseType<UserData>;
export async function sendRegister(
  dataInput: RegisterInput,
): Promise<ResponseRegister> {
  const {data, headers} = await server.post<ResponseRegister>(
    'auth/register',
    dataInput,
  );

  if (data.success) {
    console.log(headers, 'header');

    await AsyncStorage.setItem(KEY_USER, JSON.stringify(data.data));
    // await AsyncStorage.setItem(KEY_TOKEN, headers.)
    return data;
  }
  throw new Error(data.message || 'Some error occured');
}
