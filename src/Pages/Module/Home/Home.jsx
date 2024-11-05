import React from 'react'
import Footer from '../../../Layouts/Footer'
import Header from '../../../Layouts/Header'
import { Outlet } from 'react-router-dom'

const Home = () => {
    return (
        <div className='w-full flex flex-1 flex-col' >
            <Header />
            <div className='flex flex-1 justify-center bg-green-50' >
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}

export default Home