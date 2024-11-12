
import Register from '../components/Register/Register';
import { getSession } from 'next-auth/react';

export default function RegisterPage() {
    return <Register />;
}

export async function getServerSideProps(context) {
    const session = await getSession(context);


    if (session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
}
