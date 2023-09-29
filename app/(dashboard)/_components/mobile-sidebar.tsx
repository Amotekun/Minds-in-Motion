import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { SideBar } from "./sidebar"

//* This is entirely done with shadcnui, no need to write a code to toogle on or off, this is really amazing

const MobileSidebar = () => {
  return (
    <Sheet>
        <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
            <Menu />
        </SheetTrigger>
        <SheetContent side="left" className="p-0 bg-white">
            <SideBar />
        </SheetContent>
    </Sheet>
  )
}

export default MobileSidebar