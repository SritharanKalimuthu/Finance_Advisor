import { useDispatch } from 'react-redux';
import secureLocalStorage from 'react-secure-storage';
import { setshowClearcard } from '../features/chatSlice';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const Clearcard = () => {
  // Initialize the dispatch function from useDispatch
  const dispatch = useDispatch();    

  // Function to abort creating a new chat and close the confirmation card
  const abortNewchat = () => {
    dispatch(setshowClearcard(false));
  }

  // Function to create a new chat
  const createNewChat = () => {
    secureLocalStorage.removeItem('messages'); // Clear messages from local storage
    window.location.reload();
  }

  return (
    <section className="mx-2 bg-black p-8 lg:w-1/3 text-center fixed top-1/4 left-0 sm:left-1/4 lg:left-1/3 rounded-sm shadow-lg z-50">
      <FontAwesomeIcon icon={faTriangleExclamation} size="3x" className="text-red-700 drop-shadow-lg"/>
      <h1 className="text-lg font-semibold mt-3 capitalize">Are you sure you want to create Newchat?</h1>
      <p className="text-gray-500 text-sm font-medium my-2">By clicking confirm every financial idea you have will be deleted.</p>
      <div className="flex items-center justify-around mt-5">
        <button className="bg-stone-900 px-10 py-3 rounded-sm text-xs font-medium uppercase" onClick={() => abortNewchat()}>cancel</button>
        <button className="bg-red-900 px-10 py-3 rounded-sm text-xs font-medium uppercase" onClick={() => createNewChat()}>confirm</button>
      </div>
    </section>
  )
}

export default Clearcard
