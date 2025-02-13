import { useState } from 'react';
import { message } from 'antd';
import { useAuth } from '../contexts/AuthContext';

const useSignup = () => {
  const [error, setError] = useState(null); // État pour gérer les erreurs
  const [loading, setLoading] = useState(false); // État pour gérer le chargement

  const registerUser = async (values) => {
    // Vérification des mots de passe
    if (values.password !== values.passwordConfirm) {
      setError('Passwords are not the same');
      return { success: false, error: 'Passwords are not the same' };
    }

    // Vérification du rôle
    const validRoles = ['admin', 'gestionnaire', 'technicien'];
    if (!validRoles.includes(values.role.toLowerCase().trim())) {
      setError('Invalid role. Please choose a valid role: admin, gestionnaire, or technicien.');
      return { success: false, error: 'Invalid role. Please choose a valid role: admin, gestionnaire, or technicien.' };
    }

    try {
      setError(null); // Réinitialiser l'erreur
      setLoading(true); // Activer le chargement

      // Envoi de la requête d'inscription
      const res = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      // Gestion de la réponse
      if (res.status === 201) {
        message.success(data.message); // Afficher un message de succès
        return { success: true, data }; // Retourner les données en cas de succès
      } else if (res.status === 400) {
        setError(data.message); // Définir l'erreur retournée par le serveur
        return { success: false, error: data.message };
      } else {
        setError('Registration failed'); // Erreur générale
        return { success: false, error: 'Registration failed' };
      }
    } catch (error) {
      setError('An error occurred. Please try again later.'); // Erreur réseau ou autre
      return { success: false, error: 'An error occurred. Please try again later.' };
    } finally {
      setLoading(false); // Désactiver le chargement
    }
  };

  return { loading, error, registerUser }; // Retourner les états et la fonction
};

export default useSignup;