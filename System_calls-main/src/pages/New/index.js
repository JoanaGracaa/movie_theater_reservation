import { useContext, useEffect, useState } from "react"

//--React Router Dom --
import { useNavigate, useParams } from "react-router-dom"

//--- Components --- 
import Header from "../../components/Header"
import Title from "../../components/Title"

//--- React Icons ---
import { FiPlus } from "react-icons/fi"

//--- Firebase ------
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore"
import { db } from "../../services/firebaseConnection"

// --- contexts ----
import { AuthContext } from "../../contexts/auth"

//--- Toast ----
import { toast } from "react-toastify"

import './new.css'

export default function New(){

    const [ customers, setCustomers ] = useState([])
    const [ loadCustomer, setLoadCustomer ] = useState(true)
    const [ customerSelected, setCustomerSelected ] = useState(0)
    const [ idCustomer, setIdCustomer ] = useState(false)

    const [ companies, setCompanies ] = useState([])
    const [ loadCompanies, setLoadCompanies ] = useState(true)
    const [ companiesSelected, setCompaniesSelected ] = useState(0)
    const [ idCompanies, setIdCompanies  ] = useState(false)

    const { user } = useContext(AuthContext)
    const { id } = useParams()
    const navigate = useNavigate()

    const [ complemento, setcomplemento ] = useState('')
    const [ assunto, setAssunto ] = useState('')
    const [ status, setStatus ] = useState('Aberto')

    const listRef = collection(db, "customers")
    const listRefc = collection(db, "companies")

    useEffect(() => {
        async function loadCustomers(){
            const querySnapshot = await getDocs(listRef)
            .then((snapshot) => {
                let lista = []

                snapshot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        NickName: doc.data().NickName
                    })
                })

                if(snapshot.docs.size === 0){
                    console.log('Nenhum cliente foi encontrado')
                    setLoadCustomer(false)
                    setCustomers([{id: '1', NickName: 'Freela'}])
                    return
                }

                setCustomers(lista)
                setLoadCustomer(false)

                if(id) {
                    loadId(lista)
                }
            })
            .catch((error) => {
                console.log('Erro ao procurar clientes', error)
                setLoadCustomer(false)
                setCustomers([{id: '1', NickName: 'Freela'}])
            })
        }

        loadCustomers()

    }, [id])


    useEffect(() => {
        async function loadCompanies(){
            const querySnapshot = await getDocs(listRefc)
            .then((snapshot) => {
                let lista = []

                snapshot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        companyname: doc.data().companyname
                    })
                })

                if(snapshot.docs.size === 0){
                    console.log('Nenhuma empresa encontrada')
                    setLoadCompanies(false)
                    setCompanies([{id: '1', companyname: 'Freela'}])
                    return
                }

                setCompanies(lista)
                setLoadCompanies(false)

                if(id) {
                    loadId(lista)
                }
            })
            .catch((error) => {
                console.log('Erro ao procurar clientes', error)
                setLoadCompanies(false)
                setCompanies([{id: '1', companyname: 'Freela'}])
            })
        }

        loadCompanies()

    }, [id])



    async function loadId(lista){
        const docRef = doc(db, "LogTickets", id)
        await getDoc(docRef)
        .then((snapshot) => {
            setAssunto(snapshot.data().assunto)
            setStatus(snapshot.data().status)
            setcomplemento(snapshot.data().complemento)

            let indexc = lista.findIndex(item => item.id === snapshot.data().companiesID)
            setCompaniesSelected(indexc)
            setIdCompanies(true)

            let index = lista.findIndex(item => item.id === snapshot.data().customerID)
            setCustomerSelected(index)
            setIdCustomer(true)
        })
        .catch((error) => {
            console.log(error)
            setIdCustomer(false)
            setIdCompanies(false)
        })
    }

    function handleOptionChange(e){
        setStatus(e.target.value)
    }

    function handleChangeCustomer(e){
        setCustomerSelected(parseInt(e.target.value))
    }

    function handleChangeCompanies(e){
        setCompaniesSelected(parseInt(e.target.value))
    }

    async function handleRegister(e){
        e.preventDefault()

        if(idCompanies){
            const docRef = doc(db, "LogTickets", id)
            await updateDoc(docRef, {
                companies: companies[companiesSelected].companyname,
                companiesID: companies[companiesSelected].id,
                assunto: assunto,
                complemento: complemento,
                status: status,
                userId: user.uid
            })
            .then(() => {
                toast.info("Pedido atualizado com sucesso!")
                setCustomerSelected(0)
                setCompaniesSelected(0)
                setAssunto('')
                setcomplemento('')
                navigate('/dashboard')
            })
            .catch((error) => {
                toast.error('Ops, erro ao atualizar o seu Pedido!')
                console.log(error)
            })

            return
        }

        //submit a ticket
        await addDoc(collection(db, "LogTickets"), {
            created: new Date(),
            cliente: customers[customerSelected].NickName,
            clienteId: customers[customerSelected].id,
            companies: companies[companiesSelected].companyname,
            companiesID: companies[companiesSelected].id,
            assunto: assunto,
            complemento: complemento,
            status: status,
            userId: user.uid
        })
        .then(() => {
            toast.success('Pedido registado!')
            setcomplemento('')
            setAssunto('')
            setCustomerSelected(0)
            setCompaniesSelected(0)
            navigate('/dashboard')
        })
        .catch((error) => {
            toast.error('Ops erro ao registar, tente mais tarde!')
            console.log(error)
        })
    }

    return(
        <div>
            <Header />

            <div className="content">
                <Title name={id ? "Editar Pedido" : "Novo Pedido"}>
                    <FiPlus size={25}/>
                </Title>

                <div className="container">
                    <form className="form-profile" onSubmit={handleRegister}>
                        <label>Clientes</label>
                        {
                            loadCustomer ? (
                                <input type="text" disabled={true} value="...A Carregar"/>
                            ) : (
                                <select value={customerSelected} onChange={handleChangeCustomer}>
                                    {customers.map((item, index) => {
                                        return(
                                            <option key={index} value={index}>
                                                {item.NickName}
                                            </option>
                                        )
                                    })}
                                </select>
                            )
                        }

                         <label>Empresa</label>
                        {
                            loadCompanies ? (
                                <input type="text" disabled={true} value="...A Carregar"/>
                            ) : (
                                <select value={companiesSelected} onChange={handleChangeCompanies}>
                                    {companies.map((item, indexc) => {
                                        return(
                                            <option key={indexc} value={indexc}>
                                                {item.companyname}
                                            </option>
                                        )
                                    })}
                                </select>
                            )
                        }

                        <label>Assunto</label>
                        <textarea 
                            type="text" 
                            placeholder="Indique o assunto"
                            value={assunto}
                            onChange={(e) => setAssunto(e.target.value)}
                        />

                        <label>Status</label>
                        <div className="status">
                            <input 
                                type="radio"
                                name="radio"
                                value="Aberto"
                                onChange={handleOptionChange}
                                checked={status === 'Aberto'}
                            />
                            <span>Aberto</span>

                            <input 
                                type="radio"
                                name="radio"
                                value="Em Progresso"
                                onChange={handleOptionChange}
                                checked={status === 'Em Progresso'}
                            />
                            <span>Em progresso</span>

                            <input 
                                type="radio"
                                name="radio"
                                value="Fechado"
                                onChange={handleOptionChange}
                                checked={status === 'Fechado'}
                            />
                            <span>Fechado</span>
                        </div>

                        <label>Complemento</label>
                        <textarea 
                            type="text" 
                            placeholder="Descreva seu problema (opcional)"
                            value={complemento}
                            onChange={(e) => setcomplemento(e.target.value)}
                        />

                        <button type="submit">Adicionar</button>
                    </form>
                </div>
            </div>
        </div>
    )
}