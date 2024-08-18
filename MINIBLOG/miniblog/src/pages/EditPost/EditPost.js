import styles from './EditPost.module.css'

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthValue } from "../../context/AuthContext";
import { useInsertDocument } from "../../hooks/useInsertDocument";
import { useFetchDocument } from "../../hooks/useFetchDocument";
import { useUpdateDocument } from '../../hooks/useUpdateDocument';

const EditPost = () => {
    const { id } = useParams()
    const { document: post } = useFetchDocument("posts", id);

    //criando os states
    const [title, setTitle ] = useState("");
    const [image, setImage ] = useState("");
    const [body, setBody ] = useState("");
    const [tags, setTags] = useState([]);
    const [formError, setFormError] = useState("");

    useEffect(() => {
        
        if(post){
            setTitle(post.title)
            setBody(post.body)
            setImage(post.image)

            const textTags = post.tagsArray.join(", ")

            setTags(textTags);
        }

    }, [post])


    //dos hooks que eu criei
    //extrai o usuário autenticado do cntexto de autenticação
    const { user } = useAuthValue()

    //desestrutura "insertDocument" e "response" do hook criado, configurado para a coleção
    //"posts"
    const { updateDocument , response } = useUpdateDocument("posts");

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

        const data = {
            title,
            image,
            body,
            tagsArray,
            uid: user.uid,
            createdBy: user.displayName
        };


        updateDocument(id , data);

        //redirect to home page
        navigate("/dashboard"); 

    }
    //essa é a parte html
    return (
        <div className={styles.edit_post}>
            {post && (
                <>
                    <h2>Editando post: {post.title}</h2>
                    <p>Altere os dados do post como desejar</p>
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
                        <p className={styles.preview_title}>Preview da imagem atual:</p>
                        <img
                            className={styles.image_preview}
                            src={post.image}
                            alt={post.title}
                        />
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
                
                </>
            )}
        </div>
    );
};

export default EditPost;