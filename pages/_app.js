import { SessionProvider } from "next-auth/react";
import { CarritoProvider } from "../components/CarritoContext/CarritoContext";
import '../styles/globals.css';
import 'emoji-mart/css/emoji-mart.css';
import Modal from 'react-modal';


if (typeof window !== "undefined") {
    Modal.setAppElement("#__next");
}

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    return (
        <SessionProvider session={session}>
            <CarritoProvider>
                <Component {...pageProps} />
            </CarritoProvider>
        </SessionProvider>
    );
}

export default MyApp;
