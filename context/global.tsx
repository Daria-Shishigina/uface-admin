import { IClient } from 'components/clients/clients.components';
import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from 'react';
// import useLocalStorage from '../lib/useLocalStorage';

interface IProps {
  children: ReactNode;
}

interface IFields {
  field_kod: string;
  field_name: string;
  field_value: string;
}

interface IAuthorityFields {
  authority_fields: IFields[];
  authority_kod: string;
}

interface IRoles {
  authorities: IAuthorityFields[];
}

export interface IUser {
  login: string;
  status: string;
  image: string | undefined;
  roles: IRoles[];
}

export type GlobalContent = {
  authenticated: boolean;
  user: IUser | null;
  editUser: IClient | null;
  setUser: (u: IUser | null) => void;
  setEditUser: (u: IClient | null) => void;
};

export const GlobalContext = createContext<GlobalContent>({
  authenticated: false, // set a default value
  user: null,
  editUser: null,
  setUser: () => {},
  setEditUser: () => {},
});

export const useGlobalContext = () => useContext(GlobalContext);

export default function ContextProvider({ children }: IProps) {
  const [user, setUser] = useState<IUser | null>(null);
  const [editUser, setEditUser] = useState<IClient | null>(null);

  return (
    <GlobalContext.Provider
      value={{ authenticated: !!user, user, setUser, editUser, setEditUser }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
