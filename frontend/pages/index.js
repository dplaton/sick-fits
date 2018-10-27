import React, {Component} from 'react'
import Link from 'next/link'

const Home = (props) => { 
    return (
        <div>
            <p>Hello. Go to <Link href="/sell"><a>sell page</a></Link></p>
        </div>
    )
}

export default Home