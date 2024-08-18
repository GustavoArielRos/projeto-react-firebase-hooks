import styles from './CreatePost.module.css'

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthValue } from "../../context/AuthContext";
import { useInsertDocument } from "../../hooks/useInsertDocument";


const CreatePost = () => {

    //criando os states
    const [title, setTitle ] = useState("");
    const [image, setImage ] = useState("");
    const [body, setBody ] = useState("");
    const [tags, setTags] = useState([]);
    const [formError, setFormError] = useState("");

    //dos hooks que eu criei
    //extrai o usuário autenticado do cntexto de autenticação
    const { user } = useAuthValue()

    //desestrutura "insertDocument" e "response" do hook criado, configurado para a coleção
    //"posts"
    const { insertDocument , response } = useInsertDocument("posts");

    //pegando o método "useNavigate" e armazenando nessa variável
    const navigate = useNavigate();

    //função de submit
    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError("");//estado string vazio

        //validate image URL
        try {
            new URL(image);//cria um novo objeto "URL" com a url da imagem no state "image"
        }catch (error) {
            setFormError("A imagem precisa ser uma URL.");
        }

        //create the tags's array
        //dividi as tags em um array, cada tag é um elemento do array
        //cada elemento é convertido para minusculo
        const tagsArray = tags.split(",").map((tag) => tag.trim().toLowerCase());

        //check  all values
        //se um dos states não tiver valor, vai mudar o valor do state "formError"
        if(!title || !image || !tags || !body) {
            setFormError("Por favor, preencha todos os campos!");
        }

        //se tiver erro no formulário interrompe o handleSubmit
        if(formError) return;

        //função que adiciona um novo documento à coleção "posts" com esses valores
        insertDocument({
            title,
            image,
            body,
            tagsArray,
            uid: user.uid,
            createdBy: user.displayName
        })

        //redirect to home page
        navigate("/"); 

    }
    //essa é a parte html
    return (
        <div className={styles.create_post}>
            <h2>Criar post</h2>
            <p>Escreva sobre o que quiser e compartilhe o seu conhecimento! </p>
            <form onSubmit={handleSubmit}>{/*quando envia aciona essa função */}
                <label>
                    <span>Título:</span>
                    <input 
                        type="text" 
                        name="title" 
                        required 
                        placeholder="Pense num bom título..." 
                        //toda mudança muda o state title para o valor de evento
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                    />
                </label>
                <label>
                    <span>URL da imagem:</span>
                    <input 
                        type="text" 
                        name="image" 
                        required 
                        placeholder="Insira uma imagem que representa o seu post" 
                        onChange={(e) => setImage(e.target.value)}
                        value={image}
                    />
                </label>
                <label>
                    <span>Conteúdo</span>
                    <textarea 
                        name="body" 
                        required 
                        placeholder='Insira o counteúdo do post'
                        onChange={(e) => setBody(e.target.value)}
                        value={body}
                    ></textarea>
                </label>
                <label>
                    <span>Tags:</span>
                    <input 
                        type="text" 
                        name="tags" 
                        required 
                        placeholder="Insira as tags separadas por vírgua" 
                        onChange={(e) => setTags(e.target.value)}
                        value={tags}
                    />
                </label>
                {!response.loading && <button className="btn">Cadastrar</button>}
                {response.loading && (
                    <button className="btn" disabled>
                        Aguarde...
                    </button>
                )}
                {response.error && <p className="error">{response.error}</p>}
                {formError && <p className="error">{formError}</p>}
            </form>
        </div>
    );
};

export default CreatePost;