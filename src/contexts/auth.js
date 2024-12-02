import { createContext, useEffect, useState } from "react";
import {auth, db} from "../services/firebaseConnection"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AuthContext = createContext({})

function AuthProvider({children}){
    const [user, setUser] = useState(null)
    const [loadingAuth, setLoadingAuth] = useState(false)
    const [loading, setLoading] = useState(true)

    const navigation = useNavigate()

    useEffect(() => {
        async function loadUser(){
            const storageUser = localStorage.getItem('@ticketsPro')

            if(storageUser){
                setUser(JSON.parse(storageUser))
                setLoading(false)
            }

            setLoading(false)
        }

        loadUser()
    }, [])

    async function signIn(email, password){
       setLoadingAuth(true)

       await signInWithEmailAndPassword(auth, email, password)
       .then( async (value) => {
        let uid = value.user.uid

        const docRef = doc(db, "users", uid)
        const docSnap = await getDoc(docRef)

        let data = {
            uid: uid,
            nome: docSnap.data().nome,
            email: value.user.email,
            avatarUrl: docSnap.data().avatarUrl
        }

        setUser(data)
        storageUser(data)
        setLoadingAuth(false)
        toast.success("Bem-vindo(a) de volta!")
        navigation('/dashboard')
       })
       .catch((error) => {
        console.log(error)
        setLoadingAuth(false)
        toast.error("Ops, algo correu mal!")
       })
    }

    async function signUp(email, password, name){
        setLoadingAuth(true)

        await createUserWithEmailAndPassword(auth, email, password)
        .then(async(value) => {
            let uid = value.user.uid

            await setDoc(doc(db, "users", uid),{
               nome: name,
               avatarUrl: null 
            })
            .then(() => {

                let data = {
                    uid: uid,
                    nome: name,
                    email: value.user.email,
                    avatarUrl: null
                }

                setUser(data)
                storageUser(data)
                setLoadingAuth(false)
                toast.success("Bem vindo!")
                navigation('/dashboard')
            })
        })
        .catch((error) => {
            console.log(error)
            setLoadingAuth(false)
            toast.error("Introduza um endereço de email válido ou uma password com 6 digitos.")
        })
    }

    function storageUser(data){
        localStorage.setItem('@ticketsPro', JSON.stringify(data))
    }

    async function logout(){
        await signOut(auth)
        localStorage.removeItem('@ticketsPro')
        setUser(null)
    }

    return(
        <AuthContext.Provider 
            value={{
                signed: !!user,
                user,
                signIn,
                signUp,
                logout,
                loadingAuth,
                loading,
                storageUser,
                setUser
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider