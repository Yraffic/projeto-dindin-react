import './style.css'
import {Outlet, useNavigate} from 'react-router-dom'
import { clear, getItem } from '../../utils/Storege'
import { useEffect } from 'react'
import { useState } from 'react'
import sair from '../../assets/sair.svg'
import Boneco from '../../assets/Vector.svg'
import logo from '../../assets/logo.svg'
import logo1 from '../../assets/Polygon1.svg'
import EditarUsuario from '../editarUsuario'
import DetalharUsuario from '../detalharUsuario'

export default function Navbar(){
    const navegacao = useNavigate()
    const [open, setOpen] = useState(false)
    const [openDetalhar, setOpenDetalhar] = useState(false)

    useEffect(()=>{
        const token = getItem('token')

        if(!token){
            navegacao('/')
        }
    },[])    

    function sairDoUsuario(){
        clear()

        navegacao('/')
    }
    return(
        <>
        <div className='conteiner-navbar'>
                <div className="navbar">
                <div className='flex'>
                        <img className='logo1' src={logo1} />
                        <img className='logo2' src={logo} />
                        <h1 className='texto'>Dindin</h1>
                </div>
                    <div className='flex'>
                        <img 
                            className='img-boneco' 
                            src={Boneco}
                            onClick={()=> setOpen(true)}
                        />
                        <p
                            className='nome-usuario'
                            onClick={()=> setOpenDetalhar(true)}
                        >
                            {getItem('userNome')}
                        </p>
                        <img 
                            className='img-sair' 
                            src={sair}
                            onClick={()=> sairDoUsuario()}
                        />
                    </div>
                </div>
                <div className='content-page'>
                    <Outlet />
                </div>
                <EditarUsuario 
                    open={open} 
                    setOpen={setOpen}
                />
                <DetalharUsuario
                    openDetalhar={openDetalhar} 
                    setOpenDetalhar={setOpenDetalhar}
                 />
        </div>
        </>
    )
}