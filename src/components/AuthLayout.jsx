import { Outlet } from "react-router-dom"
import AuthNavbar from "./AuthNavbar";
import Footer from './Footer';

const AuthLayout = () => {
    return (
        <main className="App">
            <AuthNavbar />
            <div className="content" style={{ marginTop: '50px', marginBottom: '100px'}}>
                <Outlet />
            </div>
            <Footer />
        </main>
    )
}

export default AuthLayout