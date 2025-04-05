import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Contact from '~/pages/Contact';
import Home from '~/pages/Home';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/contact" element={<Contact />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
