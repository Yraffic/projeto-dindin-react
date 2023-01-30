import './style.css';
import Logo1 from '../../assets/logo.svg'
import Logo2 from '../../assets/Polygon1.svg'
import {Link, useNavigate} from 'react-router-dom'
import {useEffect, useState} from 'react'
import api from '../../services/api'
import {setItem, getItem} from '../../utils/Storege'

function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const navegacao = useNavigate()

  useEffect(()=>{
    const token = getItem('token')

    if(token){
      navegacao('/home')
    }
  },[])

  async function handleSubmit(e){
    e.preventDefault()
    try {
      if(!email || !senha){
        alert('preencha todos os campos')
        return
      }

      const resposta = await api.post('/login',{
        email, senha
      })
    
      const {token, consultaDados} = resposta.data
      
      setItem('token', token)
      setItem('userId', consultaDados.id)
      setItem('userNome', consultaDados.nome)
      
      navegacao('/home')
    } catch (error) {
      console.log(error)
    }
  }

  return (
      <div className="conteiner-login">
         <div className='logo'>
             <img className='um' src={Logo1}/>
             <img className='dois' src={Logo2}/>
             <h1 className='texto-logo'>Dindin</h1>
         </div>
        <div className="informacoes">

          <div className="informacao">
              <h1>Controle suas <b>finanças</b>, sem planilha chata.</h1>
              <p>
                Organizar as suas finanças nunca foi tão fácil, com o DINDIN, você tem tudo num único lugar e em um clique de distância.
              </p>
              <Link to='/cadastro' className='cadastrar'>Cadastre-se</Link>
          </div>

          <form className='login' onSubmit={handleSubmit}>
              <h1>Login</h1>
              <label htmlFor="email">E-mail</label>
              <input 
                name='email'
                id='email'
                type="text"
                value={email}
                onChange={(e)=> setEmail(e.target.value)}
               />
              <label htmlFor="password">Password</label>
              <input 
                name='password'
                id='password'
                type="password"
                value={senha}
                onChange={(e)=> setSenha(e.target.value)}
              />
              <button  className='btn-login'>Login</button>
          </form>
        </div>
      </div>
  );
}

export default Login;
