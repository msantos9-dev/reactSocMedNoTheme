import React from 'react'
import { useSelector } from 'react-redux'

const LikeButton = ({isLike, handleLike, handleUnLike}) => {
  

    return (
        <>
            {
                isLike
                ? <i className="fas fa-thumbs-up " onClick={handleUnLike}
                style={{ color: "#3c68b1 "}} />
                : <i className="far fa-thumbs-up" onClick={handleLike} />
            }
        </>
    )
}

export default LikeButton
