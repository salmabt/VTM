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

           if (res.status === 200) {
                if (data.archived) {
            setError('Compte archivé');
            message.warning('Votre compte a été archivé');
            return { success: false, error: 'Compte archivé', archived: true }; // Ajoutez error ici
            }

            message.success(data.message);
            login(data.token, data.user);
            return { success: true, user: data.user };
        } else if (res.status === 404) {
            setError(data.message);
        } else {
            // Gérer tous les autres cas d'erreur
            const errorMsg = data.message || 'Erreur de connexion';
            setError(errorMsg);
            message.error(errorMsg);
            return { 
                success: false, 
                error: errorMsg 
            };
        }
        } catch (error) {
           console.error("Erreur lors de la connexion:", error);
        const errorMsg = 'Une erreur réseau est survenue';
        setError(errorMsg);
        message.error(errorMsg);
        return { 
            success: false, 
            error: errorMsg 
        };
        }finally{
            setLoading(false);
        }
        return null;
    };

    return {loading, error, loginUser };
};

export default useLogin;