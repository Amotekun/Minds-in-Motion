"use client"

import { BarChart, Compass, Layout, List } from 'lucide-react'
import SidebarItem from './sidebar-item';
import { usePathname } from 'next/navigation';
import path from 'path';

const guestRoutes = [
    {
        id: 1,
        icon: Layout,
        label: "Dashboard",
        href: "/"
    },
    {
        id: 2,
        icon: Compass,
        label: "Browse",
        href: "/search"
    },
];

const forTeacher = [
    {
        id: 1,
        icon: List,
        label: "Courses",
        href: "/teacher/courses"
    },
    {
        id: 2,
        icon: BarChart,
        label: "Analytics",
        href: "/teacher/analytics"
    },
];

const SidebarRoutes = () => {
    const pathname = usePathname();

    const isTeacherPage =pathname.includes("/teacher");

    const routes = isTeacherPage ? forTeacher : guestRoutes;

  return (
    <div className='flex flex-col w-full'>
        {routes.map((route) => (
            <SidebarItem 
                key={route.id}
                icon={route.icon}
                label={route.label}
                href={route.href}
            />
        ))}
        
    </div>
  )
}

export default SidebarRoutes