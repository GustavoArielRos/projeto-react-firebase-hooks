import { db } from "../firebase/config";// Importa a configuração do Firebase

// Importa funções de autenticação do Firebase
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    signOut

} from 'firebase/auth'

// Importa hooks useState e useEffect do React
import { useState, useEffect } from 'react'

// Define o hook customizado useAuthentication
export const useAuthentication = () => {
    // Define o estado para armazenar erros
    const [error, setError] = useState(null);
     // Define o estado para indicar o carregamento
    const [loading, setLoading] = useState(null);

    //cleanup (limpar as funções)
    // deal with memory leak
    // Define o estado para indicar se a operação foi cancelada
    const [cancelled, setCancelled] = useState(false);

    // Obtém a instância de autenticação do Firebase
    const auth = getAuth();

    // Função para verificar se a operação foi cancelada
    function checkIfIsCancelled(){
        if(cancelled)
        {
            return; // Se a operação foi cancelada, sai da função
        }
    }

    //REGISTER
    // Função assíncrona para criar um novo usuário
    const createUser = async (data) => {
        checkIfIsCancelled(); // Verifica se a operação foi cancelada

        setLoading(true);// Define o estado de carregamento como verdadeiro
        setError(null);// Limpa qualquer mensagem de erro existente

        try {

            // Cria um novo usuário com email e senha
            // createUserWithEmailAndPassword, Esta função é importada do módulo firebase/auth e é usada 
            // para criar um novo usuário no Firebase Authentication usando um email e uma senha.
            const {user} = await createUserWithEmailAndPassword(
                auth,//A instância de autenticação do Firebase, obtida anteriormente com const auth = getAuth()
                data.email,//O email fornecido pelo usuário, que foi passado para a função createUser através do objeto data
                data.password// A senha fornecida pelo usuário, que também foi passada para a função createUser através do objeto data
            )

            // Atualiza o perfil do usuário com o nome de exibição fornecido
            //updateProfile, esta função é importada do módulo firebase/auth e é usada para atualizar o perfil 
            //de um usuário autenticado no Firebase Authentication("Sintaxe: updateProfile(user, profile)"")
            await updateProfile(user, {
                displayName: data.displayName // Nome de exibição fornecido pelo usuário
            })

            setLoading(false);// Define o estado de carregamento como falso

            return user // Retorna o usuário criado

        }catch (error) {
            // Se ocorrer um erro, exibe a mensagem de erro no console
            console.log(error.message)
            console.log(typeof error.message)

                // Define uma mensagem de erro apropriada com base no tipo de erro
                let systemErrorMessage

                if(error.message.includes("Password")) {
                    systemErrorMessage = "A senha precisa conter pelo menos 6 caracteres";
                } else if (error.message.includes("email-already")) {
                    systemErrorMessage = "e-MAIL JÁ CADASTRADO.";
                } else {
                    systemErrorMessage = "Ocorreu um erro, por favor tente mais tarde.";
                }

                setLoading(false); // Define o estado de carregamento como falso
                setError(systemErrorMessage); // Define a mensagem de erro
        }

        
    };

    //LOGOUT - sign out
    const logout = () => {
        //verifica se a operação foi cancelada
        checkIfIsCancelled();
        //função do firebase autentication que recebe a instancia de autenticação("auth") e desconecta o usuario
        signOut(auth)
    }

    //LOGIN - sign in
    const login = async(data) => {//recebe o "data" que contem os dados de login
        //ve se a operação for cancelada(se canceleed é true) essa função retornará e o login é interronpido
        checkIfIsCancelled()
        setLoading(true)//indica que a operação login esta em andamento
        setError(false)//impede mensagem de error anteriores de login
        try {
            //essa função do Firebase tenta autenticar o usuário com as credenciais fornecidas
            await signInWithEmailAndPassword(auth, data.email, data.password)
            setLoading(false);//para o carregamento indicando que o login foi concluido
        } catch(error){
            //variavel que armazenará a mensagem de erro
            let systemErrorMessage;
            //mensagem de acordo com o erro, "error" possui esses métodos do objeto
            if(error.message.includes("user-not-found")) {
                systemErrorMessage = "Usuário não encontrado"      
            } else if(error.message.includes("wrong-password")) {
                systemErrorMessage = "Senha incorreta."
            } else {
                systemErrorMessage = "Ocorreu um erro, por favor tente mais tarde"
            }
            //adicionando o erro no state
            setError(systemErrorMessage)
            setLoading(false);//indica que a operação de login foi concluida , mesmo com o erro
        }
    }
    
    // Efeito para definir a operação como cancelada ao desmontar o componente
    useEffect(() => {
      return () => setCancelled(true); // Define o estado como cancelado
      
    }, []);//roda sempre quando o componente estiver sem valor(no inicio)

    // Retorna os estados e funções do hook
    return {
        auth,
        createUser,
        error,
        loading,
        logout,
        login,
    };

};