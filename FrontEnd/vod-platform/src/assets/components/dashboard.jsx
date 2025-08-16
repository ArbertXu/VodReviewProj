import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { href } from 'react-router-dom'
import { getAuth, signOut } from 'firebase/auth'
import {auth} from "/src/firebaseAuth.js";
import { useNavigate } from "react-router-dom";
import {useState, useEffect} from "react";
import { ToastContainer, toast } from 'react-toastify'; 

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Dashboard() {
  const [userID, setUserID] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate()
  // const auth = getAuth()
  const isLoggedIn = Boolean(userID);


useEffect(() => {
const unsubscribe = auth.onAuthStateChanged((user) => {
  console.log("Auth changed:", user);
  if (user) {
    sessionStorage.setItem("user_id", user.uid);
    setUserID(user.uid);
  } else {
    sessionStorage.removeItem("user_id")
    setUserID(null)
    setUserData(null)
  }
  });

  return () => unsubscribe();
}, []);

    useEffect(() => {
        if (!userID) return;
    
        const fetchUserData = async () => {
            try {
            const user = auth.currentUser;
            if (!user) return;
            console.log(user.uid);
            const token = await user.getIdToken();
              
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user`, {
                headers: {
                "Authorization": `Bearer ${token}`,
                },
            });
    
            if (!res.ok) {
                throw new Error("Failed to fetch user data");
            }
    
            const data = await res.json();
            setUserData(data);
            } catch (err) {
            console.error("Failed to get data:", err);
            }
        };
    
        fetchUserData();
      }, [userID]);

    const navigation = [
    { name: 'My VODS', href: '/VODS', show: isLoggedIn },
    { name: 'Login', href: '/login/user', show: !isLoggedIn },
    // { name: 'Login as Coach', href: '/login/coach', current: false },
    { name: 'Register', href: '/registration/user', show: !isLoggedIn },
    {name: 'Explore', href: '/explore', show: true},
    ]
    
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      sessionStorage.clear();
      toast.success("Signed out successfully!", {
              autoClose: 500,
              onClose: () => navigate("/"),
            });
    } catch (err) {
      console.error("Error signing out", err)
    }
  }
  return (
    <Disclosure as="nav" className="bg-black">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.filter(item => item.show).map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    aria-current={item.current ? 'page' : undefined}
                    className={classNames(
                      item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'rounded-md px-3 py-2 text-sm font-medium transition duration-200',
                    )}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button
              type="button"
              className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">View notifications</span>
              <BellIcon aria-hidden="true" className="size-6" />
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden transition duration-200">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <img
                    alt=""
                    src={userData? userData.profile_img_url : "/Images/DefaultPFP.jpg"}
                    className="size-8 rounded-full"
                  />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <MenuItem>
                  <a
                    href={`/profile/${userID}`}
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden transition duration-200"
                  >
                    Your Profile
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href={`/settings/${userID}`}
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    Settings
                  </a>
                </MenuItem>
                { isLoggedIn && (
                  <MenuItem >
                  <button onClick={handleSignOut} className='block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden w-full transition duration-200'>
                    Sign Out
                  </button>
                </MenuItem>
                )}
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              className={classNames(
                item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                'block rounded-md px-3 py-2 text-base font-medium',
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
