import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';

// hooks
import { useState, useEffect } from "react";
import { useAuthentication } from './hooks/useAuthentication';

//context
import { AuthProvider } from "./context/AuthContext";

// pages
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import CreatePost from './pages/CreatePost/CreatePost';
import Dashboard from './pages/Dashboard/Dashboard';
import Search from './pages/Search/Search';
import Post from './pages/Post/Post';
import EditPost from './pages/EditPost/EditPost';

//components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {

  //inicializa o state "user" como indefinido
  const [user, setUser] = useState(undefined);
  //obtem o objeto "auth" do hook criado "useAuthentication"
  const { auth } = useAuthentication()

  //variável "loading" que será verdadeira caso o user seja indefinido
  const loadingUser = user === undefined

  useEffect(() => {
    //"onAuthStateChanged" função que escuta mudanças na autenticação do usuário
    //quando a autenticação muda o state "user" é acionado para ser alterado o valor
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

  }, [auth]);// a função o ocorre toda vez que auth se alterar

  //se loadingUser for true retorna esse parágrafo
  if(loadingUser){
    return <p>Carregando...</p>;
  }

  return (
    <div className="App">
      <AuthProvider value={{ user }}>
        <BrowserRouter>
         <Navbar />
          <div className="container">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/search" element={<Search />} />
                <Route path="/posts/:id" element={<Post />} />
                <Route 
                  path="/login" 
                  element={!user ? <Login />  : <Navigate to="/" />} 
                />
                <Route 
                  path="/register" 
                  element={!user ? <Register /> : <Navigate to="/" />} 
                />
                <Route 
                  path="/posts/edit/:id" 
                  element={user ? <EditPost /> : <Navigate to="/login" />} 
                />
                <Route 
                  path="/posts/create" 
                  element={user ? <CreatePost /> : <Navigate to="/login" />} 
                />
                <Route 
                  path="/dashboard" 
                  element={user ? <Dashboard /> : <Navigate to="/login" />} 
                />
            </Routes>
          </div>
         <Footer />
        </BrowserRouter>
      </AuthProvider> 
    </div>
  );
}

export default App;
