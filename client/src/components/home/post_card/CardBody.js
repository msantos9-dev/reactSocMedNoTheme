import React, { useState } from 'react'
import Carousel from '../../Carousel'

const CardBody = ({post}) => {
    const [readMore, setReadMore] = useState(false)

    
    return (
        <div className="card_body">
            <div className="card_body-content" 
            >
                <span>
                    {
                        post.content.length < 200 
                        ? post.content 
                        : readMore ? post.content + ' ' : post.content.slice(0, 200) + '.....'
                    }
                </span>
                {
                    post.content.length > 200 &&
                    <span style={{color: "black"}} className="readMore font-weight-bold" onClick={() => setReadMore(!readMore)}>
                        {readMore ? ' See Less...' : ' See more...'}
                    </span>
                }

            </div>
            {
                post.images.length > 0 && <Carousel images={post.images} id={post._id} />
            }
        </div>
    )
}

export default CardBody
