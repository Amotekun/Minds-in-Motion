import Navbar from "../_components/navbar"
import {SideBar}  from "../_components/sidebar"

const Dashboardlayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="h-full">
        <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
            <Navbar />
        </div>
        <div className="hidden md:flex flex-col h-full w-56 fixed inset-y-0 z-50 ">
            <SideBar />
        </div>
        <main className="md:pl-60 pt-[80px] h-full">
            {children}
        </main>
    </div>
  )
}

export default Dashboardlayout