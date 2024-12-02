import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'

import { AuthContext } from '../../contexts/auth'

import './signin.css'
import logo from '../../assets/logo.png'

export default function SignIn(){
    const [email,setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { signIn, loadingAuth } = useContext(AuthContext)

    async function handleSignIn(e) {
        e.preventDefault()

        if(email !== "" && password !== ""){
            await signIn(email, password)
        }
    }

    return(
        <div className='container-center'>
            <div className='login'>
                <div className='login-area'>
                    <img src={logo} alt="logo do sistema de Pedidos" />
                </div>

                <form onSubmit={handleSignIn}>
                    <h1>Login</h1>
                    <input 
                        type='text'
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input 
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type='submit'>
                        {loadingAuth ? 'A carregar...' : 'Entrar'}
                    </button>
                
                </form>

                <Link to="/register"> Não tem uma conta? </Link>
            </div>
        </div>
    )
}