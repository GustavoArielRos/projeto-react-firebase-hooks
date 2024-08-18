import { useContext, createContext } from "react";

//criando um novo contexto chamado "AuthContext"
const AuthContext = createContext()

//define e exporta o componente "AuthProvider"
//é um provedor de contexto
// ele fornece um valor de contexto 'value' para todos os componentes filhos ('children') que estão dentro dele
// childrens são renderizdas dentro do provedor
export function AuthProvider({children, value}) {
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

//definindo hook personalizado chamado "useAuthValue"
// ele usar o AuthContext para fornecer o valor do contexto atual
export function useAuthValue() {
    //usando o useContext para acessar o valor do contexto
    return useContext(AuthContext);
}