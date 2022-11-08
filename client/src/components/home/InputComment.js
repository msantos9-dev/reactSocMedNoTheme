import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createComment } from '../../redux/actions/commentAction'
import Icons from '../Icons'

const InputComment = ({children, post, onReply, setOnReply}) => {
    const [content, setContent] = useState('')

    const { auth, socket } = useSelector(state => state)
    const dispatch = useDispatch()

    const handleSubmit = (e) => {
        e.preventDefault()
        if(!content.trim()){
            if(setOnReply) return setOnReply(false);
            return;
        }

        setContent('')
        
        const newComment = {
            content,
            likes: [],
            user: auth.user,
            createdAt: new Date().toISOString(),
            reply: onReply && onReply.commentId,
            tag: onReply && onReply.user
        }
        
        dispatch(createComment({post, newComment, auth, socket}))

        if(setOnReply) return setOnReply(false);
    }

    return (
        <form className="card-footer comment_input" onSubmit={handleSubmit} >
            {children}
            <input type="text" placeholder="Say what you think of this post..."
            value={content} onChange={e => setContent(e.target.value)}
            style={{
               
            }} />

            <Icons  setContent={setContent} content={content} theme={""} />

            <button type="submit" className="postBtn text mt-2">
                <span style={{color: content.length > 0 ?  "#3c68b1 ": "gray", fontSize: "20px"}}><ion-icon name="send"></ion-icon></span>
            </button>
        </form>
    )
}

export default InputComment
