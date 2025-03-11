import { useState } from 'react';
import { message } from 'antd';
import { useAuth } from '../contexts/AuthContext';


const useLogin = () => {
    const { login } = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);

    const loginUser = async(values) => {
        try{
            setError(null);
            setLoading(true);
            console.log("Données envoyées au serveur:", values);
            const res = await fetch('http://localhost:3000/api/auth/login',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            const data = await res.json();
            console.log("Réponse serveur:", data); // <-- Ajoute ceci

            if ( res.status === 200) {
                message.success(data.message);
                login(data.token, data.user);
                return data.user;
            }else if (res.status === 404){
                setError(data.message);
            }
            else{
                message.error('Login failed');
            }
        } catch (error) {
            console.error("Erreur lors de la connexion:", error);
            message.error('error');
        }finally{
            setLoading(false);
        }
        return null;
    };

    return {loading, error, loginUser };
};

export default useLogin;