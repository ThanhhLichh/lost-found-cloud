import AppRouter from "./routes/AppRouter";
import { ToastContainer } from "react-toastify";

function App() {
    return (
        <>
            <AppRouter />

            <ToastContainer
                position="top-right"
                autoClose={2500}
                newestOnTop
                closeOnClick
                pauseOnHover
                draggable
                theme="light"
            />
        </>
    );
}

export default App;