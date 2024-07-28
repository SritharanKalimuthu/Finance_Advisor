import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFeather } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";


const Navbar = () => {
  return (
    <nav className="bg-zinc-950 flex items-center justify-between md:px-12 py-4 shadow-stone-900 shadow-inner">
        <a href="#" className="flex items-center">
            <FontAwesomeIcon icon={faFeather} className="bg-white text-black p-2 rounded-full mr-2 "/>
            <p className="text-sm uppercase font-bold">finchat</p>
        </a>
        <div className="flex items-center">
            <button onClick={()=>window.location.reload()} className="flex items-center bg-white text-black p-3 md:px-5 md:py-2 rounded-sm font-semibold text-xs mr-4 hover:bg-slate-300 cursor-pointer">
                <FontAwesomeIcon icon={faArrowRightToBracket} className="md:mr-2"/>
                <span className="hidden md:block">NewChat</span>
            </button>
            <a href="https://github.com/SritharanKalimuthu" target="__blank" className="flex items-center bg-black p-3 md:px-5 md:py-2 rounded-sm font-semibold border border-stone-700 text-xs hover:bg-stone-900 cursor-pointer">
                <FontAwesomeIcon icon={faGithub} className="md:mr-2"/>
                <span className="hidden md:block">GitHub</span>
            </a>
        </div>
    </nav>
  )
}

export default Navbar
