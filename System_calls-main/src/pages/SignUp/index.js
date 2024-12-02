import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'

import { AuthContext } from '../../contexts/auth'

import logo from '../../assets/logo.png'

export default function SignUp() {
  const [name, setName] = useState('')
  const [email,setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const {signUp, loadingAuth} = useContext(AuthContext)

  async function handleSubmit(e) {
    e.preventDefault()
    
    if(name !== '' && password !== '' &&  email !== '') {
      await signUp(email, password, name)
    }
  }
                
  return (
      <div className='container-center'>
        <div className='login'>
          <div className='login-area'>    
            <img src={logo} alt="logo do sistemas de Pedidos"/>
          </div>

              
          <form onSubmit={handleSubmit}>
            <h1>Criar conta</h1>
    
            <input 
              type='text'
              placeholder='Introduzir nome'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
    
            <input 
              type='text'
              placeholder='Introduzir email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
    
            <input 
              type='password'
              placeholder='Password (Com no minimo 6 numeros)'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
    
            <button type='submit'> 
              {loadingAuth ? 'A carregar' : 'Registar'} 
            </button>
          
          </form>
    
          <Link to="/"> Ja tem uma conta? Faça login! </Link>
        </div>
      </div>
    )
  }