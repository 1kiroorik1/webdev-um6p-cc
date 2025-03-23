<template>
    <div class="modal-backdrop">
      <div class="modal">
        <h3>Confirmer la suppression</h3>
        <p>Êtes-vous sûr de vouloir supprimer l'emploi "{{ itemName }}" ?</p>
        <p class="warning">Cette action est irréversible !</p>
        <div class="actions">
          <button @click="$emit('confirm')" class="btn delete">Confirmer</button>
          <button @click="$emit('cancel')" class="btn secondary">Annuler</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DeleteConfirmation',
    props: {
      itemName: {
        type: String,
        required: true
      }
    },
    emits: ['confirm', 'cancel']
  };
  </script>
  
  <style scoped>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
  }
  
  .modal {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
  
  .modal h3 {
    margin-bottom: 15px;
  }
  
  .warning {
    color: #e74c3c;
    margin: 15px 0;
    font-weight: bold;
  }
  
  .actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    gap: 10px;
  }
  </style>