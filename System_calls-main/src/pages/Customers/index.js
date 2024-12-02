import { useState } from 'react'

//-- React Icons
import { FiUser } from 'react-icons/fi'

//--React Router Dom --
import { useNavigate, useParams } from "react-router-dom"

//-- Components
import Header from '../../components/Header'
import Title from '../../components/Title'

//-- firebase
import { addDoc, collection } from 'firebase/firestore'
import { db } from '../../services/firebaseConnection'

//--Toast
import { toast } from 'react-toastify'

export default function Customers(){
    const [ nome, setNome ] = useState('') 
    const [ cc, setcc] = useState('') 
    const [ morada, setmorada] = useState('') 

    const navigate = useNavigate()

    async function handleRegister(e){
        e.preventDefault()

        if(nome !== '' && cc !== '' && morada !== ''){
            await addDoc(collection(db, "customers"), {
                NickName: nome,
                cc: cc,
                morada: morada
            })
            .then(() => {
                setNome('')
                setcc('')
                setmorada('')
                toast.success('Cliente registado com sucesso!')
                navigate('/dashboard')
            })
            .catch((error) => {
                console.log(error)
                toast.error('Erro ao fazer o registo!')
            })
        } else {
            toast.error('Preencha todos os campos!')
        }
    }

    return(
        <div>
            <Header />

            <div className='content'>
                <Title name = "Clientes">
                    <FiUser size={25} />
                </Title>

            <div className="container">
                <form className="form-profile" onSubmit={handleRegister} >
                    <label>Nome</label>
                    <input 
                        type='text'
                        placeholder="Nome do Cliente"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />

                    <label>CC</label>
                    <input 
                        type='text'
                        placeholder='Introduza o seu cc'
                        value={cc}
                        onChange={(e) => setcc(e.target.value)}
                    />

                    <label>Morada</label>
                    <input 
                        type='text'
                        placeholder='Introduza a sua morada'
                        value={morada}
                        onChange={(e) => setmorada(e.target.value)}
                    />

                    <button type='submit'>Salvar</button>
                </form>
            </div>
            </div>
        </div>
    )
}