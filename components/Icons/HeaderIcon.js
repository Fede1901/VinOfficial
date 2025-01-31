function HeaderIcon({ Icon, active }) {
    return (
        <div className="cursor-pointer flex items-center md:px-10 sm:h-14
         md:hover:bg-gray-100 rounded-xl active:border-b-2 active:border-blue-500 group">
        <Icon 
        className={`h-5 text-gray-100  
        text-center sm:h-7 mx-auto group-hover:text-red-500
        ${active && "text-blue-500"}`} />
        </div>
        
    )
}

export default HeaderIcon;
