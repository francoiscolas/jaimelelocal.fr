# encoding: UTF-8

#
# Default users
User.create({
  name: "François Colas",
  email: "francois@jaimelelocal.fr",
  password: "francois"
})
Farm.create({
  user_id: 1,
  name: "Les jardins de Béné",
  url: "les-jardins-de-bene",
  address: "Esplanade Jean Moulin\n49460 Montreuil-Juigné",
  phone: "06 95 18 14 22"
})

#
# Registering products names
ProductName.create([
  {name: "Abricots", was_reviewed: true},
  {name: "Ail", was_reviewed: true},
  {name: "Ananas", was_reviewed: true},
  {name: "Aneth", was_reviewed: true},
  {name: "Asperges", was_reviewed: true},
  {name: "Aubergines", was_reviewed: true},
  {name: "Avocats", was_reviewed: true},
  {name: "Bananes", was_reviewed: true},
  {name: "Basilic", was_reviewed: true},
  {name: "Betteraves", was_reviewed: true},
  {name: "Beurre", was_reviewed: true},
  {name: "Blettes/bettes", was_reviewed: true},
  {name: "Boeuf", was_reviewed: true},
  {name: "Canelle", was_reviewed: true},
  {name: "Carottes", was_reviewed: true},
  {name: "Cerfeuil", was_reviewed: true},
  {name: "Cerises", was_reviewed: true},
  {name: "Céleri", was_reviewed: true},
  {name: "Choux de Bruxelles", was_reviewed: true},
  {name: "Choux Fleurs", was_reviewed: true},
  {name: "Choux Frisés", was_reviewed: true},
  {name: "Choux Raves", was_reviewed: true},
  {name: "Choux Rouges", was_reviewed: true},
  {name: "Choux Verts", was_reviewed: true},
  {name: "Ciboulette", was_reviewed: true},
  {name: "Citrons", was_reviewed: true},
  {name: "Clous de girofle", was_reviewed: true},
  {name: "Concombres", was_reviewed: true},
  {name: "Coq", was_reviewed: true},
  {name: "Coriandre", was_reviewed: true},
  {name: "Cornichons", was_reviewed: true},
  {name: "Courges", was_reviewed: true},
  {name: "Courgettes", was_reviewed: true},
  {name: "Crème", was_reviewed: true},
  {name: "Échalotes", was_reviewed: true},
  {name: "Endives", was_reviewed: true},
  {name: "Estragon", was_reviewed: true},
  {name: "Épinards", was_reviewed: true},
  {name: "Fenouil", was_reviewed: true},
  {name: "Fèves", was_reviewed: true},
  {name: "Fraises", was_reviewed: true},
  {name: "Fraises Alba", was_reviewed: true},
  {name: "Fraises Gariguette", was_reviewed: true},
  {name: "Fraises Marjolaine", was_reviewed: true},
  {name: "Gingembre", was_reviewed: true},
  {name: "Groseilles", was_reviewed: true},
  {name: "Haricots verts", was_reviewed: true},
  {name: "Igname", was_reviewed: true},
  {name: "Kiwis", was_reviewed: true},
  {name: "Lait", was_reviewed: true},
  {name: "Lapins", was_reviewed: true},
  {name: "Laurier", was_reviewed: true},
  {name: "Lentilles", was_reviewed: true},
  {name: "Mangues", was_reviewed: true},
  {name: "Melons", was_reviewed: true},
  {name: "Miel", was_reviewed: true},
  {name: "Moutarde", was_reviewed: true},
  {name: "Navets", was_reviewed: true},
  {name: "Noisettes", was_reviewed: true},
  {name: "Noix", was_reviewed: true},
  {name: "Noix de muscade", was_reviewed: true},
  {name: "Oignons", was_reviewed: true},
  {name: "Olives", was_reviewed: true},
  {name: "Oranges", was_reviewed: true},
  {name: "Oseille", was_reviewed: true},
  {name: "Pamplemousses", was_reviewed: true},
  {name: "Panais", was_reviewed: true},
  {name: "Pastèques", was_reviewed: true},
  {name: "Patates douces", was_reviewed: true},
  {name: "Piments", was_reviewed: true},
  {name: "Persil", was_reviewed: true},
  {name: "Petits pois", was_reviewed: true},
  {name: "Pêches", was_reviewed: true},
  {name: "Poires", was_reviewed: true},
  {name: "Poireaux", was_reviewed: true},
  {name: "Pois cassés", was_reviewed: true},
  {name: "Pois chiches", was_reviewed: true},
  {name: "Poivre", was_reviewed: true},
  {name: "Poivrons", was_reviewed: true},
  {name: "Pommes", was_reviewed: true},
  {name: "Pommes de terre", was_reviewed: true},
  {name: "Pommes de terre Amandine", was_reviewed: true},
  {name: "Pommes de terre Belle de Fontenay", was_reviewed: true},
  {name: "Pommes de terre Charlotte", was_reviewed: true},
  {name: "Pommes de terre Chérie", was_reviewed: true},
  {name: "Pommes de terre Franceline", was_reviewed: true},
  {name: "Pommes de terre Pompadour", was_reviewed: true},
  {name: "Pommes de terre Ratte", was_reviewed: true},
  {name: "Pommes de terre Roseval", was_reviewed: true},
  {name: "Poules", was_reviewed: true},
  {name: "Poulets", was_reviewed: true},
  {name: "Pruneaux", was_reviewed: true},
  {name: "Radis", was_reviewed: true},
  {name: "Raisins", was_reviewed: true},
  {name: "Rhubarbe", was_reviewed: true},
  {name: "Romarin", was_reviewed: true},
  {name: "Rutabagas", was_reviewed: true},
  {name: "Safran", was_reviewed: true},
  {name: "Salades", was_reviewed: true},
  {name: "Salsifis", was_reviewed: true},
  {name: "Soja", was_reviewed: true},
  {name: "Taureau", was_reviewed: true},
  {name: "Taurillon", was_reviewed: true},
  {name: "Thym", was_reviewed: true},
  {name: "Tomates", was_reviewed: true},
  {name: "Topinambours", was_reviewed: true},
  {name: "Vanille", was_reviewed: true},
  {name: "Vache", was_reviewed: true},
  {name: "Veau", was_reviewed: true},
  {name: "Yaourts", was_reviewed: true},
])
