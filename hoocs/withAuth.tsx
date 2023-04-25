import { useRouter } from 'next/router';
import { useEffect } from 'react';
import {getToken} from "../helper/token";

export const withAuth = <P extends Record<string, unknown>>(
  WrappedComponent: React.ComponentType<P>,
) => {
  const AuthWrapper = (props: P) => {
    const router = useRouter();
    const token = getToken();

    useEffect(() => {
      if (!token) {
        router.push('/sign-in');
      }
    }, [token, router]);

    return token ? <WrappedComponent {...props} /> : null;
  };

  return AuthWrapper;
};