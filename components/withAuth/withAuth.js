
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';

const withAuth = (WrappedComponent) => {
    return (props) => {
        const router = useRouter();

        useEffect(() => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                if (!user) {
                    router.push('/login'); 
                }
            });
            return () => unsubscribe();
        }, [router]);

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
