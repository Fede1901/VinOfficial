
import Image from "next/image";

function Contact({ src, name, online, showFullSidebar }) {
    return (
        <div className="relative flex items-center space-x-3 mb-2 p-2 hover:bg-gray-200 rounded-xl transition duration-200 dark:hover:text-gray-500">
           <div className="relative">
               <Image
                    className="rounded-full"
                    objectFit="cover"
                    src={src}
                    width={40}
                    height={40}
                    layout="fixed"
                    alt="User Profile"
               />
               {/* Indicador de estado */}
               <span
                   className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                       online ? "bg-green-500" : "bg-red-500"
                   }`}
               ></span>
           </div>
           {showFullSidebar && <p className="font-medium text-gray-800 dark:text-gray-300">{name}</p>}
        </div>
    );
}

export default Contact;