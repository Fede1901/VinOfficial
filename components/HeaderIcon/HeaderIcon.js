function HeaderIcon({ Icon }) { 
    return (
        <div className="flex items-center cursor-pointer md:px-12 sm:h-14 md:hover:bg-[#f5e0e7] rounded-xl active:border-b-2 active:border-[#800020] group transition-all duration-200">
            <Icon className="h-5 text-white sm:h-7 mx-auto group-hover:text-[#800020] transition-transform transform group-hover:scale-110" />
        </div>
    );
}

export default HeaderIcon;
