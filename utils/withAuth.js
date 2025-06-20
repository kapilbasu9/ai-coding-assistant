import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '@/context/AuthContext';

export default function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { user, loading } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push('/login');
      }
    }, [user, loading]);

    if (!user) return null;

    return <Component {...props} />;
  };
}
