import React, { useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import About from '../pages/About'
import Posts from '../pages/Posts';
import Error from '../pages/Error';
import PostIdPage from '../pages/PostIdPage';
import { privateRoutes, publicRoutes } from '../router/routes'
import { AuthContext } from '../context';
import Loader from './UI/loader/Loader';


const AppRouter = () => {
    const {isAuth, isLoading} = useContext(AuthContext)

    if(isLoading) {
        return <Loader/>
    }

    return (
        isAuth
            ? <Routes>
                {/* <Route path="/about" element={<About />} />
                    <Route exact path="/posts" element={<Posts />} />
                    <Route exact path="/posts/:id" element={<PostIdPage />} />
                    <Route path="/error" element={<Error />} /> */}

                {privateRoutes.map(route =>
                    <Route key={route.path} path={route.path} element={<route.component />} exact={route.exact} />
                )}
                <Route path="*" element={<Navigate to="/posts" replace />} />
            </Routes>
            : <Routes>
                {/* <Route path="/about" element={<About />} />
                    <Route exact path="/posts" element={<Posts />} />
                    <Route exact path="/posts/:id" element={<PostIdPage />} />
                    <Route path="/error" element={<Error />} /> */}

                {publicRoutes.map(route =>
                    <Route key={route.path} path={route.path} element={<route.component />} exact={route.exact} />
                )}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>

    );
};

export default AppRouter;