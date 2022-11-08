import React from 'react'
import { useSelector } from 'react-redux'

const Avatar = ({src, size}) => {
   
    return (
        <img src={src} alt="avatar" className={size}
        style={{ borderStyle: 'double', borderColor: " #ececec", borderWidth: "3px"}} />
    )
}

export default Avatar
