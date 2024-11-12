"use client"
import React, { useEffect, useState } from 'react'
import Header from './_components/Header'
import SideNav from './_components/SideNav'
import { VideoDataContext } from '../_context/VideoDataContext'
import { UserDetailContext } from '../_context/UserDetailContext'
import { useUser } from '@clerk/nextjs'
import { db } from '../configs/db'
import { Users } from '../configs/schema'
import { eq } from 'drizzle-orm'

function DashboardLayout({ children }) {
    const [videoData, setVideoData] = useState([]);
    const [userDetail, setUserDetail] = useState([]);
    const [isSideNavOpen, setIsSideNavOpen] = useState(false); // state for sidebar visibility on mobile

    const { user } = useUser();

    useEffect(() => {
        user && getUserDetail();
    }, [user]);

    const getUserDetail = async () => {
        const result = await db.select().from(Users)
            .where(eq(Users.email, user?.primaryEmailAddress?.emailAddress));
        setUserDetail(result[0]);
    }

    const toggleSideNav = () => {
        setIsSideNavOpen(!isSideNavOpen);
    }

    return (
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
            <VideoDataContext.Provider value={{ videoData, setVideoData }}>
                <div>
                    {/* Mobile Toggle Button in Header */}
                    <div className="fixed md:hidden top-0 left-0 p-4">
                        <button
                            onClick={toggleSideNav}
                            className="text-primary bg-gray-200 p-2 rounded-md"
                        >
                            ☰ Menu
                        </button>
                    </div>

                    {/* Sidebar for larger screens and modal-like overlay for mobile */}
                    <div className={`fixed ${isSideNavOpen ? 'block' : 'hidden'} md:block h-screen bg-white mt-[65px] w-64 z-20`}>
                        <SideNav />
                    </div>

                    {/* Overlay for mobile when sidebar is open */}
                    {isSideNavOpen && (
                        <div
                            className="fixed inset-0 bg-black opacity-50 z-10 md:hidden"
                            onClick={toggleSideNav}
                        ></div>
                    )}

                    <div className={`flex flex-col ${isSideNavOpen ? 'overflow-hidden' : ''}`}>
                        <Header />
                        <div className='md:ml-64 p-10'>
                            {children}
                        </div>
                    </div>
                </div>
            </VideoDataContext.Provider>
        </UserDetailContext.Provider>
    );
}

export default DashboardLayout;
