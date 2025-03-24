//onfig/technicienRegions
export const technicienRegions = {
    nord: [
      'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 
      'Bizerte', 'Béja', 'Jendouba', 'Zaghouan',
      'Nabeul','Le Kef'
    ],
    milieu: [
      'Kairouan','Kasserine', 'Sidi Bouzid', 'Sfax', 'Siliana'
    ],
    sahel: ['Sousse', 'Monastir', 'Mahdia'],
    sud: [
      'Gafsa', 'Tozeur', 'Kébili', 'Gabès',
      'Médenine', 'Tataouine'
    ],
  };
  
  export const allCities = [
    ...technicienRegions.nord,
    ...technicienRegions.milieu,
    ...technicienRegions.sahel,
    ...technicienRegions.sud
  ];
  