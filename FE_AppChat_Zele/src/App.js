import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { privateRoutes } from '~/routes';
import { DefaultLayout } from '~/components/Layout';
import { Fragment } from 'react';
import useChatStore from './store/chatStore';
import React from 'react';

function App() {
    const { initializeSocket } = useChatStore();
    React.useEffect(() => {
        initializeSocket();
    }, []);

    return (
        <Router>
            <div className="App">
                <Routes>
                    {privateRoutes.map((route, index) => {
                        const Layout = route.layout === null ? Fragment : route.layout || DefaultLayout;
                        const Page = route.component;
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        );
                    })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
