"use client"

import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation';


interface SidevarItenProps {
    icon: LucideIcon;
    href: string;
    label: string
}
const SidebarItem: React.FC<SidevarItenProps> = ({icon: Icon, href, label}) => {
    const pathname = usePathname();
    const router = useRouter();

    const isActive = 
    (pathname === "/" && href === "/") ||
    pathname === href || 
    pathname?.startsWith(`${href}/`);

    const onClick = () => {
        router.push(href);
    }

  return (
    <button
        onClick={onClick}
        type='button'
        className={cn(
            "text-slate-500 flex gap--x-2 text-sm font-[500] pl-6 trnasition-all hover:text-slate-600 hover:bg-slate-300/20  ",
            isActive && "text-sky-700 bg-sky-200/20 hpver:bg-sky-200/20 "
        )}
    >
        <div className='items-center flex gap-x-2 py-4'>
            <Icon 
            size={22}
            className={cn(
                "",
                isActive && ""
            )}
            />
            {label}
        </div>
        <div 
            className={cn(
                "ml-auto opacity-0 border-2 border-sky-700 h-full transition-all ",
                isActive && "opacity-100"
            )}
        />
    </button>
  )
}

export default SidebarItem