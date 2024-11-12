import { useSession } from "next-auth/react";
import SidebarRow from "./SidebarRow";
import {
    UsersIcon,
    UserGroupIcon,
    ShoppingBagIcon,
    DesktopComputerIcon,
    CalendarIcon,
    BookmarkIcon,
    FlagIcon,
    BriefcaseIcon,
    ChevronDownIcon
} from "@heroicons/react/outline";
import { FaTrophy } from "react-icons/fa";
import { useEffect, useState } from 'react';
import { auth } from "../../firebase";

function Sidebar() {
    const { data: session, status } = useSession();
    const loading = status === "loading";
    const [user, setUser] = useState(null);

    // Obtener el usuario autenticado desde Firebase
    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            setUser(currentUser);
        }
    }, []);

    if (!session) return null;

    return (
        <div className="y-auto p-2 mt-5 xl:min-w-[490px] md:min-w-[400px] sticky top-0 invisible-scrollbar">
            {/* Fila para el perfil del usuario, visible solo si está logueado */}
            {user && (
                <SidebarRow
                    src={user.photoURL}
                    title={user.displayName || "Mi perfil"}
                    href="/Profile"
                />
            )}
            <SidebarRow src={session.user.image} title={session.user.name} />

            {/* Enlace externo para "Amigos del vino" */}
            <SidebarRow 
                Icon={UsersIcon} 
                title="Amigos del vino" 
                href="https://www.clubamigosdelvino.com/" 
                external={true}
            />

            {/* Enlaces internos */}
            <SidebarRow Icon={UserGroupIcon} title="Grupos" />
            <SidebarRow Icon={ShoppingBagIcon} title="Comprar vinos" href="/carrito-compras" />
            <SidebarRow Icon={DesktopComputerIcon} title="Mirar recomendaciones" />
            <SidebarRow Icon={CalendarIcon} title="Eventos" />
            <SidebarRow Icon={FaTrophy} title="Premios" href="/premios" />
            <SidebarRow Icon={BookmarkIcon} title="Guardado" />
            <SidebarRow Icon={FlagIcon} title="Páginas de interés" />
            <SidebarRow Icon={BriefcaseIcon} title="Trabajos en el sector" />
            <SidebarRow Icon={ChevronDownIcon} title="+ Info" />
        </div>
    );
}

export default Sidebar;
