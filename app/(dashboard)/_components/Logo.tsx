import Image from 'next/image'
import React from 'react'

const Logo = () => {
  return (
    <Image 
        height={130}
        width={130}
        src="/logo.svg"
        alt='image'
    />
  )
}

export default Logo