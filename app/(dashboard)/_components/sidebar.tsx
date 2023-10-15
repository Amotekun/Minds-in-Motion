import Logo from "./Logo"
import SidebarRoutes from "./sidebar-routes"

export const SideBar = () => {
    return (
        <div className="h-full border-r bg-white flex flex-col overflow-y-auto shadow-sm">
            <div className="p-6 font-bold text-xl">
                Minds in Motion
            </div>
            <div className="flex flex-col w-full">
                <SidebarRoutes />
            </div>
        </div>
    )
}