import { useState, useEffect, useReducer } from 'react'
import { db } from "../firebase/config" //importando configurações do banco de dados firebase
//Importa funções do Firebase Firestore para manipulação de coleções, adição de documentos e 
//criação de timestamps.
import { doc, deleteDoc } from 'firebase/firestore'

//definindo o estado inicial do "loading" e "error" como null
const initialState = {
    loading: null,
    error: null
}

//função que gerencia o estado com base no tipo de ação
const deleteReducer = (state, action) => {
    switch(action.type) {

        case "LOADING":
            return {loading: true, error: null}
        case "DELETED_DOC":
            return {loading: false, error: null}
        case "ERROR":
            return {loading: false, error: action.payload}
        default:
            return state;

    }
}

//hook personalizado que recebe o nome da coleção como argumento
export const useDeleteDocument = (docCollection) => {
    //useReducer, é um hook usado para genrenciar o estado
    //o useReducer é um useState mais complexo pois gerencia multplos sub-valores de estados
    //response usando o insertReducer e o estado inicial (initialState)
    const [response, dispatch ] = useReducer(deleteReducer, initialState);

    //deal with memory leak
    //serve para "limpar" a memoria
    const [cancelled, setCancelled] = useState(false)

    //função que verifica se a operação foi cancelada antes de despachar a ação
    const checkCancelBeforeDispatch = (action) => {
        if(!cancelled) {
            dispatch(action)
        }
    }

    //função assíncrona que recebe um documento e inicia o processo de inserção,
    //despachando a ação "loading"
    const deleteDocument = async(id) => {
        checkCancelBeforeDispatch({
            type: "LOADING",
        });

        try {
            const deletedDocument = await deleteDoc(doc(db, docCollection, id))
            //se for bem sucedida a operação, despacha a ação "inserted_doc" com o documento
            //inserido como payload
            checkCancelBeforeDispatch({
                type: "DELETED_DOC",
                payload: deletedDocument,
            })

        } catch (error) {
             //se for não bem sucedida a operação, despacha a ação "ERROR" com o documento
            //inserido como payload
            checkCancelBeforeDispatch({
                type: "ERROR",
                payload: error.message,
            })
        }
    }

    //roda uma função de "limpeza", perceba que isso ocorre quando o componente renderiza
    useEffect(() => {
        return () => setCancelled(true)
    }, []);

    //esse hook criado retorna essas coisas para poderem serem usadas em outros locais da aplicação
    return {
        deleteDocument,
        response
    }

}