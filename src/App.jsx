import "./App.css";
import Layout from "./layout/Layout";
import AuthProvider from "./pages/AuthContext";


function App() {
  return (
    <>
    <AuthProvider>
    <Layout/> 
    </AuthProvider>
     
    </>
  );
}

export default App;
