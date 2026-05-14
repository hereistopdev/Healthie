class Provider < ApplicationRecord
  has_many :enrollments, dependent: :destroy
  has_many :clients, through: :enrollments
end
