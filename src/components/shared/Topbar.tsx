/* eslint-disable react-hooks/exhaustive-deps */
import  { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations'
import { UseUserContext } from '@/context/AuthContext';
import { ModeToggle } from './mode-toggle';

export default function Topbar() {
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate()
  const {user} = UseUserContext()

  useEffect (() => {
    if (isSuccess) navigate(0)
    
  }, [isSuccess])

  return (
    <header className='topbar'>
      <div className='flex-between py-4 px-5'>
        <Link to='/' className='text-2xl font-bold'>
          <img src='/assets/images/logo.svg' alt='logo' width={130} height={325} />
        </Link>
   
        <div className='flex gap-4'>
          <div className="pl-3">
            <ModeToggle />
          </div>
          <Button variant='ghost' className='shad-button_ghost' onClick={() =>signOut()}>
            <img src="/assets/icons/logout.svg" alt="" />
          </Button>
          <Link to={`/profile/${user.id}`} className="flex-center gap-3">
          <img src={user.imageUrl || '/assets/icons/profile-placeholder.svg'} alt="" className='h-8 w-8 rounded-full'/>
          </Link>
        </div>
      </div>

    </header>
  )
}
