import React, {useEffect, useState} from 'react';
import {getToken, removeToken} from "../../helper/token";
import {useRouter} from "next/router";
import axios from "axios";
import styles from './AppHeader.module.scss';
import cn from 'classnames';

type UserType = {
  blocked: boolean;
  confirmed: boolean;
  createdAt: string;
  email: string;
  id: number;
  provider: string;
  updatedAt: string;
  username: string;
}

const AppHeader = () => {
  const [user, setUser] = useState<UserType | undefined>();
  const router = useRouter();

  const handleLogout = () => {
    removeToken();
    setUser(undefined);
    router.push("/sign-in");
  };

const token = getToken();

  const fetchLoggedInUser = async (token: string) => {
    try {
      const response = await axios(`https://limitless-hollows-24003.herokuapp.com/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if(token) {
      fetchLoggedInUser(token)
    }
  }, [token])

  const logoutClass = cn(styles.menu_button, styles.menu_logout);

  return (
    <div className={styles.menu}>
      {user ? (
        <>
          <span>{user.username}</span>
          <button className={logoutClass} onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <button className={styles.menu_button} onClick={()=>router.push('/sign-in')}>Sign In</button>
          <button className={styles.menu_button} onClick={()=>router.push('/sign-up')}>Sign Up</button>
        </>
      )}
    </div>
  );
};

export default AppHeader;