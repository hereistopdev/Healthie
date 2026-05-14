class CreateInterviewSchema < ActiveRecord::Migration[7.2]
  def change
    create_table :providers do |t|
      t.string :name, null: false
      t.string :email, null: false
      t.timestamps
    end
    add_index :providers, :email, unique: true

    create_table :clients do |t|
      t.string :name, null: false
      t.string :email, null: false
      t.timestamps
    end
    add_index :clients, :email, unique: true

    create_table :enrollments do |t|
      t.references :provider, null: false, foreign_key: true
      t.references :client, null: false, foreign_key: true
      t.integer :plan, null: false, default: 0
      t.timestamps
    end
    add_index :enrollments, [:provider_id, :client_id], unique: true

    create_table :journal_entries do |t|
      t.references :client, null: false, foreign_key: true
      t.text :body, null: false
      t.timestamps
    end
  end
end
