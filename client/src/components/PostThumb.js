import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import defThumb from '../images/defThumb.jpg'

const PostThumb = ({posts, result}) => {
    const { theme } = useSelector(state => state)

    if(result === 0) return <h2 className="text-center text-info">No Post to show</h2>
   

    return (
        <div className="post_thumb">
            {
                posts.map(post => ( post.images.length > 0 ? 
                    //with image data
                    <Link key={post._id} to={`/post/${post._id}`}>
                        <div className="post_thumb_display">

                            {
                                post.images[0].url.match(/video/i)
                                ?<video controls src={post.images[0].url} alt={post.images[0].url}
                                style={{filter: theme ? 'invert(1)' : 'invert(0)'}} />

                                :<img src={post.images[0].url} alt={post.images[0].url}
                                style={{filter: theme ? 'invert(1)' : 'invert(0)'}} />
                                
                            }

                            <div className="post_thumb_menu">
                                <i className="far fa-thumbs-up"> {post.likes.length}</i>
                                <i className="far fa-comment"> {post.comments.length}</i>
                            </div>
                        </div>
                    </Link> : 
                    
                    <Link key={post._id} to={`/post/${post._id}`}>
                        <div className="post_thumb_display" style={{ filter: theme ? 'invert(1)' : 'invert(0)', backgroundImage: `url(${defThumb})` , textAlign:"center", color:"white", fontSize: "22px", padding: "25%"}}>

                            
                            <span >"{post.content.length > 50 ? post.content.slice(0,50) + "..." : post.content.slice(0,50)}"</span>

                            <div className="post_thumb_menu" style={{fontSize: "2rem"}}>
                            <span className='mr-3'><ion-icon name="thumbs-up-outline"></ion-icon> {post.likes.length}</span>
                            <span><ion-icon name="chatbubbles-sharp" ></ion-icon> {post.comments.length}</span>
                               
                            </div>
                        </div>
                    </Link>
                
                ))
            }
        </div>
    )
}

export default PostThumb
