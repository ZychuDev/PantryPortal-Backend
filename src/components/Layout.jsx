import { Outlet } from "react-router-dom"
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
    return (
        <main className="App">
            <Navbar />
            <div className="content" style={{ marginTop: '50px', marginBottom: '100px'}}>
                <Outlet />
            </div>
            <Footer />

        </main>
    )
}

export default Layout