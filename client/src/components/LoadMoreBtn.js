import React from 'react'
import { useSelector } from 'react-redux'

const LoadMoreBtn = ({result, page, load, handleLoadMore}) => {
   
    return (
        <>
            {
                result < 9 * (page - 1) ? '' : 

                !load && <button   className="btnLoadMore mx-auto d-block"
                onClick={handleLoadMore}>
                    Load more
                </button>
            }
            
        </>
    )
}

export default LoadMoreBtn