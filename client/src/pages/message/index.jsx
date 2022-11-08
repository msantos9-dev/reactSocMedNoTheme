import React from 'react'
import LeftSide from '../../components/message/LeftSide'
import { useSelector  } from 'react-redux'

const Message = () => {
    

    return (
        <div className="message d-flex" >
            <div className="col-md-4 border-right px-0" >
                <LeftSide />
            </div>

            <div className="col-md-8 px-0 right_mess">
                <div className="d-flex justify-content-center 
                align-items-center flex-column h-100" style={{ fontSize: '10rem', color:"#3c68b1 "}}>

                    <ion-icon name="chatbubbles-outline"></ion-icon>
                    
                </div>
            </div>
        </div>
    )
}

export default Message
