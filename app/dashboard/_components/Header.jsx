import { UserButton } from '@clerk/nextjs'
import React ,{useContext}from 'react'
import {Button} from '../../../@/components/ui/button.jsx'
import Image from 'next/image'
import { UserDetailContext } from '../../_context/UserDetailContext';

function Header() {
  const {userDetail,setUserDetail}=useContext(UserDetailContext);

  return (
    <div className='p-3 px-5 flex items-center justify-between shadow-md'>
        <div className='flex gap-3 items-center'>
            <Image src ={'/logo.png'} width = {30} height={30} alt='logo'/>
        <h2 className='font-bold text-xl'>Ai Short Vid 🤟</h2>
        </div>
      <div className='flex gap-3 items-center'>
        <div className='flex gap-2 items-center'>
          <Image src={'/star.png'} alt= 'star'width={20} height={20}/>
        <h2>{userDetail?.credits}</h2>
        </div>
        <UserButton/>
      </div>
    </div>
  )
}

export default Header
