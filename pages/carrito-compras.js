import React from 'react';
import Header from '../components/Header/Header';
import Sidebar from '../components/Sidebar/Sidebar';
import ComprasVinos from '../components/ComprasVinos/ComprasVinos';
import Widgets from '../components/Widgets/Widgets';

export async function getServerSideProps() {
    
    return {
        props: {
           
        },
    };
}

function CarritoComprasPage() {
    return (
        <div className="h-screen bg-gray-100 dark:bg-gray-800 dark:text-white">
            <Header />
            <main className="flex h-[calc(100vh-64px)] overflow-y-auto">
                {}
                <aside className="w-1/5 hidden md:block">
                    <Sidebar />
                </aside>

                {}
                <section className="flex-grow max-w-4xl p-4 md:ml-2">
                    <ComprasVinos />
                </section>

                {}
                <aside className="w-1/5 hidden lg:block">
                    <Widgets />
                </aside>
            </main>
        </div>
    );
}

export default CarritoComprasPage;
