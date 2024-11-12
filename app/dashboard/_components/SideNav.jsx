"use client"
import { FileVideo, PanelsTopLeft, ShieldPlus } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState, useContext } from 'react'
import { UserButton, useUser } from '@clerk/nextjs'
import { db } from '../../configs/db' // Import database config
import { Users } from '../../configs/schema' // Import Users schema
import { eq } from 'drizzle-orm'
import { UserDetailContext } from '../../_context/UserDetailContext'

function SideNav() {
    const MenuOption = [
        {
            id: 1,
            name: 'Dashboard',
            path: '/dashboard',
            icon: PanelsTopLeft
        },
        {
            id: 2,
            name: 'Create New',
            path: '/dashboard/create-new',
            icon: FileVideo
        },
        {
            id: 3,
            name: 'Upgrade',
            icon: ShieldPlus
        },
    ]

    const path = usePathname();
    const { user } = useUser();
    const { userDetail, setUserDetail } = useContext(UserDetailContext);

    // State to handle input and loading status
    const [creditAmount, setCreditAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showUpgrade, setShowUpgrade] = useState(false); // Show/hide Add Credits section

    // Function to dynamically update credits
    const updateCredits = async () => {
        if (creditAmount <= 0) {
            alert("Please enter a valid credit amount");
            return;
        }

        setLoading(true);
        const newCredits = userDetail.credits + creditAmount;

        // Update credits in database
        await db.update(Users).set({ credits: newCredits })
            .where(eq(Users.email, user.primaryEmailAddress.emailAddress));

        // Update context with new credit value
        setUserDetail(prev => ({ ...prev, credits: newCredits }));
        setCreditAmount(0); // Reset input
        setLoading(false);
        setShowUpgrade(false); // Hide the add credits section after updating
    };

    return (
        <div className='w-64 h-screen shadow-md p-5'>
            <div className='grid gap-3'>
                {MenuOption.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => item.name === 'Upgrade' ? setShowUpgrade(!showUpgrade) : null} // Toggle Add Credits section on "Upgrade" click
                    >
                        <Link href={item.path || '#'} key={index}>
                            <div className={`flex items-center gap-3 p-3 hover:bg-primary hover:text-white rounded-md cursor-pointer ${path == item.path && 'bg-primary text-white'}`}>
                                <item.icon />
                                <h2>{item.name}</h2>
                            </div>
                        </Link>
                    </div>
                ))}

                {/* Render only UserButton for Account without navigation */}
                <div className="flex items-center gap-3 p-3 hover:bg-primary hover:text-white rounded-md cursor-pointer">
                    <UserButton />
                    <h2>Account</h2>
                </div>
                
                {/* Conditionally render Add Credits Section */}
                {showUpgrade && (
                    <div className='mt-5 p-3 bg-gray-100 rounded-md'>
                        <h3 className='font-bold text-lg'>Add Credits</h3>
                        <input
                            type="number"
                            value={creditAmount}
                            onChange={(e) => setCreditAmount(Number(e.target.value))}
                            placeholder="Enter credit amount"
                            className="border p-2 w-full rounded-md mt-2 mb-3"
                        />
                        <button
                            onClick={updateCredits}
                            disabled={loading}
                            className="bg-primary text-white p-2 rounded-md w-full"
                        >
                            {loading ? "Updating..." : "Add Credits"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SideNav;
