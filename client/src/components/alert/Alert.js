import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'

import Loading from './Loading'
import Swal from 'sweetalert2';


const Notify = () => {
    const { alert } = useSelector(state => state, 2500)
    const dispatch = useDispatch()

    return (
        <div>
            {alert.loading && <Loading />}

            {
                alert.error && 
                Swal.fire({
                    text: alert.error,
                    icon: 'error',
                    customClass: {
                    container: 'position-absolute'
                    },
                    toast: true,
                    position: 'top-right',
                    timer: 1500,
                    showConfirmButton: false,
                
                  }) && dispatch({type: GLOBALTYPES.ALERT, payload: {}})
               
            }

            {
                alert.success && 
               Swal.fire({
                    icon: 'success',
                    text: alert.success,
                    customClass: {
                      container: 'position-absolute'
                    },
                    toast: true,
                    position: 'top-right',
                    timer: 1500,
                    showConfirmButton: false,
                
                  }) && dispatch({type: GLOBALTYPES.ALERT, payload: {}})
            }
            
        </div>
    )
}

export default Notify
