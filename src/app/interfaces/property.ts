export interface Property {
     title: string,
     category:  string,
     surface:  string,
     rooms:  string,
     description?:  string, // ? permet de rendre la valeur optionnelle
     price:  string,
     sold:  boolean
     photos?: any[];
}

//l'interface permet de définir des paramètres précis attendu pour un élément, pour un ensemble de données
