import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { 
    SearchIcon, 
    BellIcon, 
    ChatIcon, 
    ViewGridIcon, 
    ChevronDownIcon, 
    ShoppingCartIcon, 
    HomeIcon 
} from "@heroicons/react/solid";
import { FiLogOut, FiHelpCircle } from "react-icons/fi";
import { FaInstagram, FaWifi } from "react-icons/fa";
import { useCarrito } from "../CarritoContext/CarritoContext"; 
import { db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";

function Header({ onToggleContacts }) {
    const { data: session } = useSession();
    const router = useRouter();
    const { totalProductos } = useCarrito();
    
    const [darkMode, setDarkMode] = useState(() => {
        
        const savedMode = localStorage.getItem("darkMode");
        return savedMode === "true"; 
    });

    const [showNotifications, setShowNotifications] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [showMenu, setShowMenu] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const fullName = session?.user?.name || "Nombre no disponible";
    const joiningYear = session?.user?.joiningYear || "2024";

    useEffect(() => {
        // Aplica o quita la clase 'dark' en el body
        if (darkMode) {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
        // Guarda la preferencia en localStorage
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    const handleSearch = (e) => {
        e.preventDefault();
        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        if (lowerCaseSearchTerm.includes("compras") || lowerCaseSearchTerm.includes("vinos")) {
            router.push("/carrito-compras");
        } else if (lowerCaseSearchTerm.includes("premios")) {
            router.push("/premios");
        } else {
            window.open(`https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`, "_blank");
        }
        setSearchTerm("");
    };

    const handleCartClick = () => {
        if (totalProductos > 0) {
            router.push("/carrito-compras"); 
        } else {
            alert("Carrito vacío");
        }
    };

    const iconStyle = "h-8 w-8 text-white dark:text-gray-200 cursor-pointer transition-colors duration-200";

    return (
        <div className="sticky top-0 z-50 bg-[#446596] dark:bg-gray-800 dark:text-white flex items-center shadow-md p-2 lg:px-5">
            <div className="flex items-center">
                <Image
                    src="/logo.png"
                    width={40}
                    height={20}
                    layout="fixed"
                    alt="Logo de Vin"
                />
                <div className="flex ml-2 items-center rounded-full bg-gray-100 dark:bg-gray-700 p-2">
                    <SearchIcon className="h-6 text-gray-600 dark:text-gray-200 cursor-pointer" />
                    <form onSubmit={handleSearch}>
                        <input
                            className="hidden md:inline-flex flex-shrink ml-2 items-center bg-transparent outline-none placeholder-gray-500 dark:placeholder-gray-300"
                            type="text"
                            placeholder="Buscar en Vin"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form>
                </div>
            </div>

            <div className="flex justify-center items-center flex-grow space-x-8">
                <HomeIcon className={`${iconStyle} hover:text-[#800020] hover:bg-[#f5e0e7] rounded-full p-1`} onClick={() => router.push("/")} />
                <FaInstagram className={`${iconStyle} hover:text-[#800020] hover:bg-[#f5e0e7] rounded-full p-1`} />
                <FiHelpCircle className={`${iconStyle} hover:text-[#800020] hover:bg-[#f5e0e7] rounded-full p-1`} />
                <FaWifi className={`${iconStyle} hover:text-[#800020] hover:bg-[#f5e0e7] rounded-full p-1`} />

                <div className="relative">
                    <ShoppingCartIcon className={`${iconStyle} hover:text-[#800020] hover:bg-[#f5e0e7] rounded-full p-1`} onClick={handleCartClick} />
                    {totalProductos > 0 && (
                        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            {totalProductos}
                        </span>
                    )}
                </div>

                <div className="relative">
                    <BellIcon className={`${iconStyle} hover:text-[#800020] hover:bg-[#f5e0e7] rounded-full p-1`} onClick={() => setShowNotifications(!showNotifications)} />
                    {notificationCount > 0 && (
                        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            {notificationCount}
                        </span>
                    )}
                </div>

                <ChatIcon className={`${iconStyle} hover:text-[#800020] hover:bg-[#f5e0e7] rounded-full p-1`} onClick={onToggleContacts} />
                <ViewGridIcon className={`${iconStyle} hover:text-[#800020] hover:bg-[#f5e0e7] rounded-full p-1`} />
                <FiLogOut onClick={signOut} className={`${iconStyle} hover:text-[#800020] hover:bg-[#f5e0e7] rounded-full p-1`} />
                <ChevronDownIcon className={`${iconStyle} hover:text-[#800020] hover:bg-[#f5e0e7] rounded-full p-1`} onClick={() => setShowMenu(!showMenu)} />
            </div>

            {showMenu && (
                <div className="absolute top-full right-60 mt-2 w-60 bg-white dark:bg-gray-700 p-4 rounded-lg shadow-lg z-50">
                    <div className="flex flex-col space-y-3">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Perfil & Ajustes</h3>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                            <p><strong>Nombre y Apellido:</strong> {fullName}</p>
                            <p><strong>Año de ingreso:</strong> {joiningYear}</p>
                        </div>
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="w-full bg-[#446596] text-white py-1.5 rounded-md hover:bg-[#365478] transition-colors text-sm"
                        >
                            {darkMode ? "Modo claro" : "Modo oscuro"}
                        </button>
                        <button
                            onClick={signOut}
                            className="w-full bg-[#800020] text-white py-1.5 rounded-md hover:bg-[#6e001a] transition-colors text-sm"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Header;
