document.addEventListener('DOMContentLoaded', () => {
  const form      = document.getElementById('user-form');
  const nameInput = document.getElementById('user-name');
  const listEl    = document.getElementById('user-list');

  async function loadUsers() {
    const res   = await fetch('/users');
    const users = await res.json();
    listEl.innerHTML = users.map(u => `
      <li data-id="${u._id}">
        <span class="name">${u.name}</span>
        <span>
          <button class="edit">✎</button>
          <button class="delete">🗑</button>
        </span>
      </li>
    `).join('');
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    await fetch('/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: nameInput.value })
    });
    nameInput.value = '';
    loadUsers();
  });

  listEl.addEventListener('click', async e => {
    const li = e.target.closest('li');
    if (!li) return;
    const id = li.dataset.id;
    if (e.target.matches('.delete')) {
      await fetch(`/users/${id}`, { method: 'DELETE' });
      loadUsers();
    }
    if (e.target.matches('.edit')) {
      const oldName = li.querySelector('.name').textContent;
      const newName = prompt('Edit name:', oldName);
      if (newName && newName !== oldName) {
        await fetch(`/users/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newName })
        });
        loadUsers();
      }
    }
  });

  loadUsers();
});