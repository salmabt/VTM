import { useState } from 'react';
import { message } from 'antd';
import { useAuth } from '../contexts/AuthContext';

const useSignup = () => {
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const registerUser = async (values) => {
    // Vérification des mots de passe
    if (values.password !== values.passwordConfirm) {
      return setError('Passwords are not the same');
    }

    // Vérification du rôle
    const validRoles = ['admin', 'gestionnaire', 'technicien']; // Liste des rôles valides
    if (!validRoles.includes(values.role.toLowerCase().trim())) {
      return setError('Invalid role. Please choose a valid role: admin, gestionnaire, or technicien.');
    }

    try {
      setError(null);  // Reset error
      setLoading(true); // Commence le chargement

      // Envoi de la requête d'inscription
      const res = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      // Vérification de la réponse
      if (res.status === 201) {
        message.success(data.message);  // Affichage du message de succès
        login(data.token, data.user);   // Connexion de l'utilisateur
      } else if (res.status === 400) {
        setError(data.message);  // Erreur retournée par le serveur
      } else {
        message.error('Registration failed');  // Erreur générale
      }
    } catch (error) {
      message.error('An error occurred. Please try again later.'); // Gestion de l'erreur réseau
    } finally {
      setLoading(false);  // Fin du chargement
    }
  };

  return { loading, error, registerUser };
};

export default useSignup;
