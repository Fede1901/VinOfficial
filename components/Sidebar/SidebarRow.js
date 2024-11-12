import Link from "next/link";

function SidebarRow({ Icon, title, src, href }) {
    const content = (
        <div className="flex items-center space-x-2 p-4 hover:bg-gray-200 rounded-xl cursor-pointer">
            {src && (
                <img
                    className="rounded-full"
                    src={src}
                    width={30}
                    height={30}
                    alt=""
                />
            )}
            {Icon && <Icon className="h-8 w-8 text-[#446596]" />}
            <p className="hidden sm:inline-flex font-medium">{title}</p>
        </div>
    );

    return typeof href === "string" && href ? (
        <Link href={href}>{content}</Link>
    ) : (
        content
    );
}

export default SidebarRow;
