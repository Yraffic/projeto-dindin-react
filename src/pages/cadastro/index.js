import './style.css'
import Logo1 from '../../assets/logo.svg'
import Logo2 from '../../assets/Polygon1.svg'
import {Link} from 'react-router-dom'
import {useState} from 'react'
import api from '../../services/api'

export default function Cadastrar(){
  const [nome, setNome]= useState('')
  const [email, setEmail]= useState('')
  const [senha, setSenha]= useState('')
  const [confirmacaoSenha, setConfirmacaoSenha]= useState('')


  async function handleSubmit(e){
    e.preventDefault()
    try {
      if(!nome || !email || !senha || !confirmacaoSenha){
        alert('todos os campos devem ser preenchidos!!')
        return
      }
      if(senha.length < 7){
        return alert('senha deve ter 8 ou mais digítos!')
    }
      if(senha !== confirmacaoSenha){
        alert('senha e confirmação devem ser iguais')
        return
      }
        console.log(nome)
      const resposta = await api.post('/usuario', {
        nome, email, senha
      })
      
      if(resposta.status === 201){
        alert('usuario cadastrado : )')
      }
      
    } catch (error) {
      alert('erro interno no servidor! 500')
      console.log(error)
    }
  }

    return (
        <div className='conteiner-cadastro'>
          <div className='logo'>
             <img className='um' src={Logo1}/>
             <img className='dois' src={Logo2}/>
             <h1 className='texto-logo'>Dindin</h1>
          </div>
           <form className='card'  onSubmit={handleSubmit}>
            <h1>Cadastre-se</h1>
         <div className='inputs'>
            <label htmlFor="nome">Nome</label>
              <input 
                name='nome'
                id='nome'
                value={nome}
                type="text"
                onChange={(e)=> setNome(e.target.value)}
               />
            <label htmlFor="email">E-mail</label>
              <input 
                name='email'
                id='email'
                type="text"
                value={email}
                onChange={(e)=> setEmail(e.target.value)}
               />
            <label htmlFor="password">Senha</label>
              <input 
                name='password'
                id='password'
                value={senha}
                type="password"
                onChange={(e)=> setSenha(e.target.value)}
               />
            <label htmlFor="confirmacao">Confirmação de senha</label>
              <input 
                name='confirmacao'
                id='confirmacao'
                type="password"
                value={confirmacaoSenha}
                onChange={(e)=> setConfirmacaoSenha(e.target.value)}
               />
            </div>
               <button className='btn-cadastrar'>Cadastrar</button>
               <Link to='/'>Já tem cadastro? Clique aqui!</Link>
           </form>
        </div>
    )
}