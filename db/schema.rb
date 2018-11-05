# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2017_11_10_205027) do

  create_table "business_hours", force: :cascade do |t|
    t.integer "farm_id"
    t.integer "day_of_week"
    t.boolean "activated"
    t.time "opens_at"
    t.time "closes_at"
    t.index ["farm_id"], name: "index_business_hours_on_farm_id"
  end

  create_table "farms", force: :cascade do |t|
    t.integer "user_id"
    t.string "name"
    t.string "url"
    t.string "shortdesc"
    t.string "email"
    t.string "phone"
    t.string "website"
    t.text "address"
    t.float "lat"
    t.float "lng"
    t.string "page_header_file_name"
    t.string "page_header_content_type"
    t.bigint "page_header_file_size"
    t.datetime "page_header_updated_at"
    t.json "page_content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_farms_on_name", unique: true
    t.index ["url"], name: "index_farms_on_url", unique: true
    t.index ["user_id"], name: "index_farms_on_user_id"
  end

  create_table "subscribtions", force: :cascade do |t|
    t.integer "farm_id"
    t.integer "user_id"
    t.string "email"
    t.index ["farm_id", "user_id"], name: "index_subscribtions_on_farm_id_and_user_id", unique: true
    t.index ["farm_id"], name: "index_subscribtions_on_farm_id"
    t.index ["user_id"], name: "index_subscribtions_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.boolean "show_email", default: false, null: false
    t.string "url"
    t.text "bio"
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

end
