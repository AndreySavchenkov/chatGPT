import React, {useEffect, useState} from 'react';
import {getToken, removeToken} from "../../helper/token";
import {useRouter} from "next/router";
import axios from "axios";

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
      const response = await axios(`http://localhost:1337/api/users/me`, {
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

  return (
    <div>
      {user ? (
        <>
          <span>{user.username}</span>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <button onClick={()=>router.push('/sign-in')}>Sign In</button>
          <button onClick={()=>router.push('/sign-up')}>Sign Up</button>
        </>
      )}
    </div>
  );
};

export default AppHeader;