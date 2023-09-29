"use client"

import { UserButton } from '@clerk/nextjs'
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';

//!This page is used to render the navbar routes.
//? It is also used to switch between the teacher and the player page.

const NavbarRoutes = () => {
    const pathname = usePathname();

    const isTeacherPage = pathname?.startsWith("/teacher");
    const isPlayerPage = pathname?.startsWith("/chapter");

  return (
    <div className='ml-auto gap-x-2 flex items-center'>
        {isTeacherPage || isPlayerPage ? (
            <Link href="/">
                <Button className="gap-2" variant="ghost">
                    <LogOut className='h-4 w-4'/>
                    Exit
                </Button>
            </Link>
        ): (
            <Link href="/teacher/courses">
                <Button variant="ghost">
                    Teacher Page
                </Button>
            </Link>
        )}
        <UserButton afterSignOutUrl='/' />
    </div>
  )
}

export default NavbarRoutes

