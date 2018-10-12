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
