
import Head from 'next/head';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import Widgets from '../Widgets/Widgets';
import { useState } from "react";

export default function Layout({ children }) {
    const [contactsVisible, setContactsVisible] = useState(false);

    return (
        <div className="h-screen bg-gray-100 dark:bg-gray-800 dark:text-white overflow-y-auto">
            <Head>
                <title>Vin, conecta con el vino</title>
                <link rel="icon" href="/logo4withe.png" type="/logo4withe.png" />
            </Head>

            {/* Header */}
            <Header onToggleContacts={() => setContactsVisible((prev) => !prev)} />

            {/* Main Content */}
            <main className="flex">
                {/* Sidebar */}
                <div className="h-screen overflow-y-auto  xl:min-w-[250px] md:min-w-[200px] sticky top-0">
                    <Sidebar />
                </div>

                {/* Main Content (Feed or other page-specific content) */}
                <div className="flex-grow max-w-3xl mx-auto p-4">
                    {children}
                </div>

                {/* Widgets */}
                <div className="w-1/4 lg:w-1/5 xl:w-1/5 hidden lg:block sticky top-0 h-screen">
                    <Widgets showSidebar={contactsVisible} />
                </div>
            </main>
        </div>
    );
}
