//src/api/gestionnaire
const API_URL = 'http://localhost:3000/api/gestionnaires'; // Remplace par l'URL de ton backend


export const loginGestionnaire = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) throw new Error('Erreur lors de la connexion');

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getAllGestionnaires = async () => {
  try {
    const response = await fetch(`${API_URL}`);
    const data = await response.json();
    return data; // Retourne directement le tableau
  } catch (error) {
    return [];
  }
};

// Ajouter un gestionnaire
export const createGestionnaire = async (gestionnaire) => {
  try {
    const response = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gestionnaire),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Erreur inconnue');
    }
    
    return data;
  } catch (error) {
    throw new Error(error.message || 'Erreur réseau');
  }
};


// Mettre à jour un gestionnaire
export const updateGestionnaire = async (id, updatedData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Échec de la mise à jour');
    }
    
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Supprimer un gestionnaire
export const deleteGestionnaire = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erreur lors de la suppression du gestionnaire');
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};


// Récupérer les gestionnaires archivés
export const getArchivedGestionnaires = async () => {
  try {
    const response = await fetch(`${API_URL}/archived`);
    if (!response.ok) throw new Error('Erreur serveur');
    const data = await response.json();
    return data; // Même structure que getAllGestionnaires
  } catch (error) {
    return [];
  }
};
// Archiver un gestionnaire
export const archiveGestionnaire = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}/archive`, {
      method: 'PUT',
    });
    if (!response.ok) throw new Error('Erreur lors de l\'archivage');
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Restaurer un gestionnaire
export const restoreGestionnaire = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}/restore`, {
      method: 'PUT',
    });
    if (!response.ok) throw new Error('Erreur lors de la restauration');
    const data = await response.json();
    return data.data; // Retourne directement les données utiles
  } catch (error) {
    console.error(error);
    return null;
  }
};
export default {
  loginGestionnaire,
  getAllGestionnaires,
  createGestionnaire,
  updateGestionnaire,
  deleteGestionnaire,
  getArchivedGestionnaires,
  archiveGestionnaire,
  restoreGestionnaire,
};
