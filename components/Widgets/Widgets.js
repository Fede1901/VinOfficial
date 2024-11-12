import { useState, useEffect } from "react";
import { widgetscontacts } from "./Data";
import { SearchIcon, UserGroupIcon } from "@heroicons/react/outline";
import Contact from "./Contact";

function Widgets({ showSidebar }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [showFullSidebar, setShowFullSidebar] = useState(showSidebar);

    useEffect(() => {
        setShowFullSidebar(showSidebar);
    }, [showSidebar]);

    const filteredContacts = widgetscontacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (!showFullSidebar) {
            setSearchTerm("");
        }
    }, [showFullSidebar]);

    return (
        <div
            className={`fixed top-[60px] right-0 h-[calc(100vh-50px)] transition-all duration-300 ease-in-out 
                ${showFullSidebar ? "w-90 bg-white shadow-lg" : "w-20 bg-transparent"} flex flex-col`}
            onMouseEnter={() => setShowFullSidebar(true)}
            onMouseLeave={() => setShowFullSidebar(false)}
        >
            {/* Contenedor fijo para el título y la barra de búsqueda */}
            <div className="mb-6">
                <div className={`flex items-center ${showFullSidebar ? "justify-center" : "justify-start"} text-gray-100 mb-4`}>
                    {showFullSidebar ? (
                        <h2 className="text-xl font-semibold text-gray-700">Amigos</h2>
                    ) : (
                        <UserGroupIcon className="h-8 ml-2" style={{ color: "#800020" }} />
                    )}
                </div>
                <div className="relative flex items-center text-gray-500">
                    {showFullSidebar && <SearchIcon className="h-5 text-gray-500 absolute left-3" />}
                    {showFullSidebar && (
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="w-full bg-gray-100 rounded-full pl-10 pr-4 py-1 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    )}
                </div>
            </div>

            {/* Contenedor scrollable para la lista de contactos */}
            <div className="flex-grow overflow-y-auto space-y-5 pr-3">
                {filteredContacts.map((contact) => (
                    <Contact key={contact.id} src={contact.src} name={contact.name} online={contact.online} showFullSidebar={showFullSidebar} />
                ))}
            </div>
        </div>
    );
}

export default Widgets;
