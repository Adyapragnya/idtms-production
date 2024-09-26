import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilAccountLogout,
  cilAddressBook,
  cilBell,
  cilCalculator,
  cilChartPie,
  cilChevronCircleRightAlt,
  cilCursor,
  cilDescription,
  cilDrop,
  cilHotTub,
  cilNewspaper,
  cilNoteAdd,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilSpreadsheet,
  cilStar,
  cilUserPlus,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { color } from 'chart.js/helpers'

const _nav = [
  // {
  //   component: CNavItem,
  //   name: 'Dashboard',
  //   to: '/dashboard',
  //   icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  //   badge: {
  //     color: 'info',
  //     // text: 'NEW',
  //   },
  // },
  {
    component: CNavTitle,
    name: 'Customer Management',
  },
  {
    component: CNavItem,
    name: 'Create Customer',
    to: '/createcustomer',
    icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
    badge:{
      color: 'info',
      // text: 'New'
    }
  },
  {
    component: CNavItem,
    name: 'Customer List',
    to: '/customerlist',
    icon: <CIcon icon={cilSpreadsheet} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Document Management',
  },
  {
    component: CNavItem,
    name: 'Store Documents',
    to: '/storedocuments',
    icon: <CIcon icon={cilNoteAdd} customClassName="nav-icon" />,
    badge:{
      color: 'info',
      // text: 'New'
    }
  },
  {
    component: CNavItem,
    name: 'View Documents',
    to: '/viewdocuments',
    icon: <CIcon icon={cilNewspaper} customClassName="nav-icon" />,
    badge:{
      color: 'info',
      // text: 'New'
    }
  },
 


  

  {
    component: CNavItem,
    name: 'Track Documents',
    to: '/trackdocuments',
    icon: <CIcon icon={cilChevronCircleRightAlt} customClassName="nav-icon" />,
    badge: {
      color: 'info',
    },
  },

  

  
  

]

export default _nav

