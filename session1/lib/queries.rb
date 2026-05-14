# frozen_string_literal: true

require_relative "../config/environment"

# The four relations the interview brief asks for, written as plain scopes you can
# paste into `bin/console` or call from specs.

module InterviewQueries
  module_function

  def clients_for_provider(provider)
    provider.clients.order(:name)
  end

  def providers_for_client(client)
    client.providers.order(:name)
  end

  def journal_entries_for_client(client)
    client.journal_entries.order(created_at: :asc)
  end

  def journal_entries_for_provider(provider)
    JournalEntry
      .joins(client: :enrollments)
      .where(enrollments: { provider_id: provider.id })
      .distinct
      .order(created_at: :asc)
  end
end

if File.expand_path($PROGRAM_NAME) == File.expand_path(__FILE__)
  raise "Run `rake db:migrate db:seed` first" unless Provider.exists?

  p0 = Provider.first
  c0 = Client.first

  puts "Clients for #{p0.name}: #{InterviewQueries.clients_for_provider(p0).pluck(:name).join(', ')}"
  puts "Providers for #{c0.name}: #{InterviewQueries.providers_for_client(c0).pluck(:name).join(', ')}"
  puts "Journal (oldest → newest) for #{c0.name}:"
  InterviewQueries.journal_entries_for_client(c0).each { |j| puts "  #{j.created_at.to_date} — #{j.body.truncate(60)}" }
  puts "All journal rows visible to #{p0.name} (oldest → newest):"
  InterviewQueries.journal_entries_for_provider(p0).each { |j| puts "  #{j.client.name}: #{j.body.truncate(50)}" }
end
