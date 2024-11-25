Rails.application.routes.draw do
  resources :sessions, only: [:new, :create, :destroy, :show]
  resources :employees, only: [:index, :show, :edit, :update, :destroy, :new, :create]
  resources :registrations, only: [:new, :create]
  delete '/logout', to: 'sessions#destroy'
  root 'sessions#new' 
end