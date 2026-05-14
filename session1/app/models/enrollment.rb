class Enrollment < ApplicationRecord
  enum :plan, { basic: 0, premium: 1 }

  belongs_to :provider
  belongs_to :client

  validates :client_id, uniqueness: { scope: :provider_id }
end
