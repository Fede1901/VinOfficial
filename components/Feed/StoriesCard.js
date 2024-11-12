import Image from "next/image";

function StoryCard({ src, name }) {
  return (
    <div className="relative w-32 h-48 cursor-pointer transition transform duration-200 ease-out hover:scale-105 flex flex-col items-center">
      {/* Contenedor de la imagen */}
      <div className="relative w-32 h-40">
        <Image
          src={src}
          alt={`Historia de ${name}`} 
          fill 
          sizes="(max-width: 768px) 100vw, 50vw" 
          className="object-cover rounded-lg"
          style={{ objectFit: "cover" }} 
        />
      </div>
      {/* Nombre de la historia */}
      <p className="mt-2 text-xs font-semibold text-center text-gray-700 dark:text-gray-300">
        {name}
      </p>
    </div>
  );
}

export default StoryCard;