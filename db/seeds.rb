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
  address: "Allée Frédéric Chopin, 49460 Montreuil-Juigné, France",
  lat: 47.54076892246994,
  lng: -0.6044452259033051,
  phone: "06 95 18 14 22"
})
