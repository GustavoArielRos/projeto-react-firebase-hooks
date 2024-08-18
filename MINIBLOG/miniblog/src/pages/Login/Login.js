import React from "react";
import styles from "./Login.module.css";

import { useState, useEffect } from "react";

import { useAuthentication } from "../../hooks/useAuthentication";

const Login = () => {

    //criando os states
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    //erro do backend
    //Você está desestruturando o objeto retornado pelo useAuthentication para acessar login, 
    //authError (renomeado de error), e loading.
    //error, está sendo renomeado para authError para evitar conflitos de nomes (por exemplo, se você já 
    //tiver outro estado chamado error no seu componente).
    const {login, error: authError, loading} = useAuthentication();

     // Função chamada ao enviar o formulário
    const handleSubmit = async (e) => {
        e.preventDefault() // Previne o comportamento padrão do formulário de recarregar a página
        setError("");
        // Cria um objeto usuário com os dados do formulário
        const user = {
            //nome das variáveis no state      
            email,
            password,
        };
        const res = await login(user);//res vai armazenar a função login com os dados de user
        // Exibe os dados do usuário no console (aqui você pode adicionar sua lógica de registro)
        console.log(res);        
    }

    // useEffect para monitorar mudanças em authError
    useEffect(() => {
        // Se authError tiver um valor (não for nulo ou indefinido)
        if(authError) {
            setError(authError); // Atualiza o estado error com o valor de authError
        }

    }, [authError])// Array de dependências: o efeito roda sempre que authError mudar

    return (
        <div className={styles.login}>
            <h1>Entrar</h1>
            <p>Faça o login para poder utilizar o sistema</p>
            {/*Formulário que chama a função handleSubmit ao ser enviado*/}
            <form onSubmit={handleSubmit}>
                <label>
                    <span>Email:</span>
                    <input 
                        type="email" 
                        name="email"
                        required
                        placeholder='E-mail do usuário'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                </label>
                <label>
                    <span>Senha:</span>
                    <input 
                        type="password" 
                        name="password"
                        required
                        placeholder='Senha do usuário'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}  
                    />
                </label>
                {/*fazendo um "jogo" com o loading e o botão que aparece */}
                {!loading && <button className="btn">Entrar</button>}
                {loading && (
                    <button className="btn" disabled>
                        Aguarde...
                    </button>
                )}
                
                {/*Exibe um paragrafo com a mensagem de erro se existir*/}
                {error != "" && <p className>{error}</p>}
            </form>
        </div>
    );
};

export default Login