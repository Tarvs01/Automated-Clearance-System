import React from 'react'
import { Link } from 'react-router-dom'

function Modal({message, redirect} : any) {
  return (
      <div className='modal-cont'>
          {message}
          <Link to={redirect}>OK</Link>
    </div>
  )
}

export default Modal