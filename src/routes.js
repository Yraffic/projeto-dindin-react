import Login from './pages/login';
import Cadastrar from './pages/cadastro';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom'
import Home from './pages/home';
import Navbar from './componentes/header'
import {getItem} from './utils/Storege'

function ProtectedRoutes({ redirectTo }) {
  const token = getItem('token')
  
  const isAuthenticated = token;

  return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} />
}

function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/cadastro" element={<Cadastrar />} />

      <Route element={<ProtectedRoutes redirectTo='/' />}>
            <Route path='/home' element={<Home />}/>
      </Route>

    </Routes>

  );
}

export default MainRoutes;