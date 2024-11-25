import dynamic from 'next/dynamic';
const  PlaygroundApp  = dynamic(()=>import('@/components/LexicalTemplatePlayground/lexical-playground/src'),{ssr:false}) ;
import SideNav from '@/components/Navbar/SideNav/Dashboard/SideNav'
import React from 'react'

const index = () => {
  return (
    <>
    <SideNav/>
    <PlaygroundApp/>
    </>

  )
}

export default index