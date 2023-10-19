"use client"
import clsx from "clsx"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navbar(){
    const pathname = usePathname()
    const navs = [
        {
            name: 'Lessons',
            href: '/'
        },
        {
            name: 'Exams',
            href: '/exams'
        },
    ]

    return(
        <div className='m-10 rounded-full flex justify-center items-center gap-6 w-fit mx-auto text-[#717171] border border-[#262626] bg-[#050505]'>
          {navs.map((nav, index) => (
            <Link key={index} href={nav.href} className={clsx("w-fit px-3 py-2 rounded-full", pathname !== nav.href || 'text-[#000000] bg-[#ffffff] font-semibold')}>
                <h1>{nav.name}</h1>
            </Link>
          ))}
        </div>
    )
}