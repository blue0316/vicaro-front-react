import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({children}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    console.log(location.pathname)
  })

  return (
    <div className="flex h-screen overflow-hidden">
      {
        location.pathname.includes('sign') || location.pathname === '/forgot' ?
          <main className="w-full">
            <div>
              {children}
            </div>
          </main>
          :
          <>
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
              <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
              <main className="flex-1">
                <div className="h-full">
                  {children}
                </div>
              </main>
            </div>
          </>
      }
    </div>
  )
}

export default Layout;
