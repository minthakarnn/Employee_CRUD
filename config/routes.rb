Rails.application.routes.draw do
  resources :users, only: [:new, :create, :index, :show]
  resources :sessions, only: [:new, :create, :destroy, :show]
  resources :employees
  resources :registrations, only: [:new, :create]
  root 'sessions#new' # ตั้งค่า root เป็นหน้า login
end