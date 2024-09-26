import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <span className="ms-1">Designed and Developed by  <b className='text-info'> Adyapragnya Technologies Private Limited</b> </span>
      </div>
      <div className="ms-auto">
        <span className="me-1">All Rights Reserved to &copy; <b className='text-info'> IDTMS.</b></span>
        
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
