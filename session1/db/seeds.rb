# frozen_string_literal: true

# Tiny seed so `rake db:seed` gives you something to poke in console.
dana = Provider.create!(name: "Dana Kim", email: "dana@example.test")
marc = Provider.create!(name: "Marcus Ortiz", email: "marcus@example.test")

alex = Client.create!(name: "Alex Rivera", email: "alex@example.test")
sam = Client.create!(name: "Sam Okonkwo", email: "sam@example.test")

Enrollment.create!(provider: dana, client: alex, plan: :premium)
Enrollment.create!(provider: dana, client: sam, plan: :basic)
Enrollment.create!(provider: marc, client: alex, plan: :basic)

JournalEntry.create!(client: alex, body: "Felt steady after lunch — energy held.")
JournalEntry.create!(client: sam, body: "Skipped the walk; will try again tomorrow.")

puts "Seeded #{Provider.count} providers, #{Client.count} clients, #{JournalEntry.count} journal rows."
