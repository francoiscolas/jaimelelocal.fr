class PopulateFarmCategories < ActiveRecord::Migration[5.2]
  def up
    FarmCategory.create([
        {name: "Fruits"},
        {name: "Fruits transformés"},
        {name: "Laitages de brebis"},
        {name: "Laitages de bufflonne"},
        {name: "Laitages de chamelle"},
        {name: "Laitages de chèvre"},
        {name: "Laitages de vache"},
        {name: "Laitages de yak"},
        {name: "Lapins"},
        {name: "Légumes"},
        {name: "Miel"},
        {name: "Noisettes"},
        {name: "Noix"},
        {name: "Oeufs"},
        {name: "Pain"},
        {name: "Pâtes"},
        {name: "Petits fruits"},
        {name: "Plantes à parfum, aromatiques et médicinales"},
        {name: "Vin"},
        {name: "Viande de boeuf"},
        {name: "Viande de veau"},
        {name: "Viande de mouton"},
        {name: "Viande de porc"},
        {name: "Volailles"},
    ])
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
