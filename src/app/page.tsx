import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { Bot } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Page = () => {
    return (
        <div>
            <Navbar />
            <div className='h-[90vh] w-full flex justify-center items-center'>
                <div className="max-w-screen-xl">
                    <div className='flex flex-col items-center'>
                        <div className='flex items-center'>
                            <Bot size={96} className='mr-5' />
                            <h1 className='font-bold text-2xl'>
                                Welcome to your personal smart note taking app.
                            </h1>
                        </div>
                        <Link href='/auth/signup'>
                            <Button>
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page