import React, { useState, useEffect, useRef } from 'react'
import UserCard from '../UserCard'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import MsgDisplay from './MsgDisplay'
import Icons from '../Icons'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import { imageShow, videoShow } from '../../utils/mediaShow'
import { imageUpload } from '../../utils/imageUpload'
import { addMessage, getMessages, loadMoreMessages, deleteConversation } from '../../redux/actions/messageAction'
import LoadIcon from '../../images/loading.gif'
import Swal from 'sweetalert2';

const RightSide = () => {
    const { auth, message, socket, peer } = useSelector(state => state)
    const dispatch = useDispatch()

    const { id } = useParams()
    const [user, setUser] = useState([])
    const [text, setText] = useState('')
    const [media, setMedia] = useState([])
    const [loadMedia, setLoadMedia] = useState(false)
    const [isEmpty, setisEmpty] = useState(true)

    const refDisplay = useRef()
    const pageEnd = useRef()

    const [data, setData] = useState([])
    const [result, setResult] = useState(9)
    const [page, setPage] = useState(0)
    const [isLoadMore, setIsLoadMore] = useState(0)

    const history = useHistory()
    

    useEffect(() => {
       
        const newData = message.data.find(item => item._id === id)
        if(newData){
            setisEmpty(false)
            setData(newData.messages)
            setResult(newData.result)
            setPage(newData.page)
            
        }
    },[message.data, id])

    useEffect(() => {
        if(id && message.users.length > 0){
            setTimeout(() => {
                refDisplay.current.scrollIntoView({behavior: 'smooth', block: 'end'})
            },50)

            const newUser = message.users.find(user => user._id === id)
            if(newUser) setUser(newUser)
        }
    }, [message.users, id])

    const handleChangeMedia = (e) => {
        const files = [...e.target.files]
        let err = ""
        let newMedia = []

        files.forEach(file => {
            if(!file) return err = "File does not exist."

            if(file.size > 1024 * 1024 * 5){
                return err = "The image/video largest is 5mb."
            }

            return newMedia.push(file)
        })

        if(err) dispatch({ type: GLOBALTYPES.ALERT, payload: {error: err} })
        setMedia([...media, ...newMedia])
    }

    const handleDeleteMedia = (index) => {
        const newArr = [...media]
        newArr.splice(index, 1)
        setMedia(newArr)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(!text.trim() && media.length === 0) return;
        setText('')
        setMedia([])
        setLoadMedia(true)

        let newArr = [];
        if(media.length > 0) newArr = await imageUpload(media)

        const msg = {
            sender: auth.user._id,
            recipient: id,
            text, 
            media: newArr,
            createdAt: new Date().toISOString()
        }

        setLoadMedia(false)
        await dispatch(addMessage({msg, auth, socket}))
        if(refDisplay.current){
            refDisplay.current.scrollIntoView({behavior: 'smooth', block: 'end'})
        }
    }

    useEffect(() => {
        const getMessagesData = async () => {
            if(message.data.every(item => item._id !== id)){
                await dispatch(getMessages({auth, id}))
                setTimeout(() => {
                    if (!refDisplay.current) return;
                    refDisplay.current.scrollIntoView({behavior: 'smooth', block: 'end'})
                },50)
            }
        }
        
        getMessagesData()
    },[id, dispatch, auth, message.data])


    // Load More
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting){
                setIsLoadMore(p => p + 1)
            }
        },{
            threshold: 0.1
        })

        observer.observe(pageEnd.current)
    },[setIsLoadMore])

    useEffect(() => {
        if(isLoadMore > 1){
            if(result >= page * 9){
                dispatch(loadMoreMessages({auth, id, page: page + 1}))
                setIsLoadMore(1)
            }
        }
        // eslint-disable-next-line
    },[isLoadMore])

    const handleDeleteConversation = () => {
    //     if(window.confirm('Do you want to delete?')){
    //         dispatch(deleteConversation({auth, id}))
    //         return history.push('/message')
    //     }
    //}
    
    Swal.fire({
        text: "Are you sure you want to delete this conversation?",
        showCancelButton: true,
        confirmButtonColor: '#3c68b1 ',
        cancelButtonColor: 'gray',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        allowEnterKey: true,
        timer: 3000,
        timerProgressBar: true,
        
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                text: 'Conversation deleted successfully.',
                icon: 'success',
                customClass: {
                  container: 'position-absolute'
                },
                toast: true,
                position: 'top-right',
                timer: 1500,
                showConfirmButton: false
              })

           // Swal.fire({ text: "Conversation deleted successfully.",  timer: 300,})
            dispatch(deleteConversation({auth, id, socket}))
           //dispatch(typesGLOBALTYPES.ALERT, payload: {success: "Please add your photo."})
            
            
        }else{
            
            return history.push('/message')
        }
    })
    
    return history.push('/message')
    }
    // Call
    const caller = ({video}) => {
        const { _id, avatar, username, fullname } = user

        const msg = {
            sender: auth.user._id,
            recipient: _id, 
            avatar, username, fullname, video
        }
        dispatch({ type: GLOBALTYPES.CALL, payload: msg })
    }

    const callUser = ({video}) => {
        const { _id, avatar, username, fullname } = auth.user

        const msg = {
            sender: _id,
            recipient: user._id, 
            avatar, username, fullname, video
        }

        if(peer.open) msg.peerId = peer._id

        socket.emit('callUser', msg)
    }

    const handleAudioCall = () => {
        caller({video: false})
        callUser({video: false})
    }
    
    const handleVideoCall = () => {
        caller({video: true})
        callUser({video: true})
    }

    return (
        <>
            <div className="message_header" style={{cursor: 'pointer', borderTopRightRadius:"10px"}} >
                {
                    user.length !== 0 &&
                   
                    
                    <UserCard user={user}>
                    <div>
                       
                        <span className="mr-3" style={{fontSize:"1.4rem"}} ><ion-icon  name="call-outline" onClick={handleAudioCall}></ion-icon></span>

                        <span className="mr-3" style={{fontSize:"1.4rem"}} ><ion-icon name="videocam-outline" onClick={handleVideoCall}></ion-icon></span>

                        <span className="mr-3" style={{fontSize:"1.4rem"}} ><ion-icon name="trash-bin-outline" onClick={handleDeleteConversation} ></ion-icon></span>
                    </div>
                </UserCard> 
                    
                }
            </div>

            <div className="chat_container" 
            style={{height: media.length > 0 ? 'calc(100% - 180px)' : ''}} >
                <div className="chat_display" ref={refDisplay}>
                    <button style={{marginTop: '-25px', opacity: 0}} ref={pageEnd}>
                        Load more
                    </button>

                    {
                        data.map((msg, index) => (
                                <div key={index}>
                                    {
                                        msg.sender !== auth.user._id &&
                                        <div className="chat_row other_message">
                                            <MsgDisplay user={user} msg={msg} theme={""} />
                                        </div>
                                    }

                                    {
                                        msg.sender === auth.user._id &&
                                        <div className="chat_row you_message" >
                                            <MsgDisplay user={auth.user} msg={msg} theme={""} data={data} />
                                        </div>
                                    }
                                </div>
                        ))
                    }
                    

                   {
                       loadMedia && 
                       <div className="chat_row you_message">
                           <img src={LoadIcon} alt="loading"/>
                       </div>
                   }

                </div>
            </div>

            <div className="show_media" style={{display: media.length > 0 ? 'grid' : 'none'}} >
                {
                    media.map((item, index) => (
                        <div key={index} id="file_media">
                            {
                                item.type.match(/video/i)
                                ? videoShow(URL.createObjectURL(item), "")
                                : imageShow(URL.createObjectURL(item), "")
                            }
                            <span onClick={() => handleDeleteMedia(index)} >&times;</span>
                        </div>
                    ))
                }
            </div>

            <form className="chat_input" onSubmit={handleSubmit} >
                <input className="mt-1" type="text" placeholder="Enter your message..."
                value={text} onChange={e => setText(e.target.value)}
                />

                <Icons setContent={setText} content={text} theme={""} />

                <div className="file_upload mt-2 mr-3">
                <span style={{fontSize: "20px", color:"#3c68b1", }} ><ion-icon name="images"></ion-icon></span>
                    <input type="file" name="file" id="file"
                    multiple accept="image/*,video/*" onChange={handleChangeMedia} />
                </div>

              
                <span className='mt-2'  disabled={(text || media.length > 0) ? false : true} 
                style={{color: (text || media.length > 0) ?  "#3c68b1 ": 'gray  ', cursor:"pointer", fontSize: "20px"}}>
                    <ion-icon style={{}} onClick={handleSubmit} name="send"></ion-icon></span>
            </form>
        </>
    )
}

export default RightSide
