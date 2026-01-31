let currentTab = 'courses';
let currentData = [];
let editIndex = -1;
let modalInstance = null;

// Login check
function checkLogin() {
    const pass = document.getElementById('admin-pass').value;
    if (pass === 'admin123') {
        document.getElementById('login-overlay').classList.add('d-none');
        document.getElementById('admin-panel').classList.remove('d-none');
        modalInstance = new bootstrap.Modal(document.getElementById('editorModal'));
        showTab('courses');
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
}

// Tab Switching
function showTab(tab) {
    currentTab = tab;
    // Update Sidebar UI
    document.querySelectorAll('.sidebar a').forEach(el => el.classList.remove('active'));
    document.querySelector(`.sidebar a[onclick="showTab('${tab}')"]`).classList.add('active');

    // Update Header
    document.getElementById('page-title').textContent = `Manage ${tab.charAt(0).toUpperCase() + tab.slice(1)}`;
    document.getElementById('add-btn').classList.remove('d-none');
    document.getElementById('save-general-btn').classList.add('d-none');

    loadData();
}

async function loadData() {
    currentData = await fetchData(currentTab);
    const container = document.getElementById('content-area');
    container.innerHTML = '<div class="spinner-border" role="status"></div>';

    if (currentTab === 'general') {
        renderGeneralForm(container);
    } else {
        renderTable(container);
    }
}

// Renderers
function renderTable(container) {
    if (!Array.isArray(currentData)) {
        container.innerHTML = '<p>Error: Data is not a list.</p>';
        return;
    }

    let html = '<div class="table-responsive bg-white rounded shadow-sm"><table class="table table-hover mb-0"><thead><tr>';

    // Headers based on first item or manual
    const keys = getItemKeys();
    keys.forEach(k => html += `<th>${k.toUpperCase()}</th>`);
    html += '<th class="text-end">ACTIONS</th></tr></thead><tbody>';

    currentData.forEach((item, index) => {
        html += '<tr>';
        keys.forEach(k => {
            let val = item[k];
            if (k.toLowerCase().includes('imageurl')) val = `<img src="${val}" height="40">`;
            if (Array.isArray(val)) val = val.length + ' items';
            if (typeof val === 'object' && val !== null) val = 'Object';
            html += `<td>${val || ''}</td>`;
        });
        html += `
        <td class="text-end">
            <button class="btn btn-sm btn-outline-primary me-2" onclick="openModal(${index})"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteItem(${index})"><i class="bi bi-trash"></i></button>
        </td></tr>`;
    });
    html += '</tbody></table></div>';
    container.innerHTML = html;
}

function getItemKeys() {
    if (currentTab === 'courses') return ['title', 'category', 'fees'];
    if (currentTab === 'testimonials') return ['name', 'role'];
    if (currentTab === 'gallery') return ['caption', 'imageUrl'];
    if (currentTab === 'events') return ['eventName', 'date', 'location'];
    return ['id'];
}

function renderGeneralForm(container) {
    document.getElementById('add-btn').classList.add('d-none'); // No add button for general
    document.getElementById('save-general-btn').classList.remove('d-none');

    const d = currentData || {};
    // Flatten for simplicity or custom form
    let html = `
    <div class="card p-4">
        <h5 class="mb-3">Basic Info</h5>
        <div class="mb-3">
            <label class="form-label">Institute Name</label>
            <input type="text" class="form-control" id="gen-name" value="${d.name || ''}">
        </div>
        <div class="mb-3">
            <label class="form-label">Logo URL</label>
            <input type="text" class="form-control" id="gen-logo" value="${d.logo || ''}">
        </div>
        <div class="mb-3">
            <label class="form-label">Hero Background Image URL (Home)</label>
            <input type="text" class="form-control" id="gen-hero" value="${d.heroImage || ''}">
        </div>

        <h5 class="mb-3 mt-4">About Section</h5>
        <div class="mb-3">
            <label class="form-label">About Page Image URL</label>
            <input type="text" class="form-control" id="gen-about-img" value="${d.about?.image || ''}">
        </div>
        <div class="mb-3">
            <label class="form-label">About Text</label>
            <textarea class="form-control" id="gen-about-content" rows="4">${d.about?.content || ''}</textarea>
        </div>
        
        <h5 class="mb-3 mt-4">Mission & Vision</h5>
        <div class="mb-3">
            <label class="form-label">Mission Image URL</label>
            <input type="text" class="form-control" id="gen-mission-img" value="${d.mission?.image || ''}">
        </div>
        <div class="mb-3">
            <label class="form-label">Vision Image URL</label>
            <input type="text" class="form-control" id="gen-vision-img" value="${d.vision?.image || ''}">
        </div>
        
        <h5 class="mb-3 mt-4">Contact Details</h5>
        <div class="mb-3">
            <label class="form-label">Phone</label>
            <input type="text" class="form-control" id="gen-phone" value="${d.contact?.phone || ''}">
        </div>
        <div class="mb-3">
            <label class="form-label">Email</label>
            <input type="email" class="form-control" id="gen-email" value="${d.contact?.email || ''}">
        </div>
        <div class="mb-3">
            <label class="form-label">Address</label>
            <textarea class="form-control" id="gen-address">${d.contact?.address || ''}</textarea>
        </div>
        <div class="mb-3">
            <label class="form-label">Map Embed URL</label>
            <input type="text" class="form-control" id="gen-map" value="${d.contact?.mapUrl || ''}">
        </div>
    </div>`;
    container.innerHTML = html;
}

// CRUD Operations
function deleteItem(index) {
    if (confirm('Are you sure you want to delete this item?')) {
        currentData.splice(index, 1);
        saveData();
    }
}

function openModal(index = -1) {
    editIndex = index;
    const isEdit = index >= 0;
    const item = isEdit ? currentData[index] : {};

    document.getElementById('modal-title').textContent = isEdit ? 'Edit Item' : 'Add New Item';

    const form = document.getElementById('editor-form');
    let html = '';

    if (currentTab === 'courses') {
        html += createInput('id', 'ID (Slug)', item.id || '', true);
        html += createInput('title', 'Course Title', item.title || '');
        html += createInput('category', 'Category', item.category || '');
        html += createInput('imageUrl', 'Card Image URL', item.imageUrl || '');
        html += createInput('heroImage', 'Hero Detail Background URL', item.heroImage || '');
        html += createInput('fees', 'Fees', item.fees || '');
        html += createTextarea('description', 'Course Description', item.description || '');
        html += createTextarea('advantages', 'Advantages (One per line)', (item.advantages || []).join('\n'));
        html += createTextarea('benefits', 'Benefits (One per line)', (item.benefits || []).join('\n'));
        html += createTextarea('curriculum', 'Curriculum (One per line)', (item.curriculum || []).join('\n'));
    } else if (currentTab === 'testimonials') {
        html += createInput('name', 'Student Name', item.name || '');
        html += createInput('role', 'Student Role/Placement', item.role || '');
        html += createInput('image', 'Portrait Image URL', item.image || '');
        html += createTextarea('text', 'Testimonial Content', item.text || '');
    } else if (currentTab === 'gallery') {
        html += createInput('caption', 'Image Caption', item.caption || '');
        html += createInput('imageUrl', 'Image URL', item.imageUrl || '');
        html += createInput('category', 'Category (Classroom/Labs etc)', item.category || '');
    } else if (currentTab === 'events') {
        html += createInput('id', 'Event ID', item.id || Date.now());
        html += createInput('eventName', 'Event Name', item.eventName || '');
        html += createInput('date', 'Event Date (YYYY-MM-DD)', item.date || '');
        html += createInput('time', 'Time', item.time || '');
        html += createInput('location', 'Location', item.location || '');
        html += createInput('imageUrl', 'Banner Image URL', item.imageUrl || '');
        html += createTextarea('description', 'Description', item.description || '');
    }

    form.innerHTML = html;
    modalInstance.show();
}

function createInput(id, label, value, required = false) {
    return `<div class="mb-3">
        <label class="form-label">${label}</label>
        <input type="text" class="form-control" id="f-${id}" value="${value}" ${required ? 'required' : ''}>
    </div>`;
}

function createTextarea(id, label, value) {
    return `<div class="mb-3">
        <label class="form-label">${label}</label>
        <textarea class="form-control" id="f-${id}" rows="4">${value}</textarea>
    </div>`;
}

async function saveItem() {
    const val = (id) => document.getElementById(`f-${id}`).value;
    const newItem = editIndex >= 0 ? { ...currentData[editIndex] } : {};

    if (currentTab === 'courses') {
        newItem.id = val('id');
        newItem.title = val('title');
        newItem.category = val('category');
        newItem.imageUrl = val('imageUrl');
        newItem.heroImage = val('heroImage');
        newItem.fees = val('fees');
        newItem.description = val('description');
        newItem.advantages = val('advantages').split('\n').filter(x => x.trim());
        newItem.benefits = val('benefits').split('\n').filter(x => x.trim());
        newItem.curriculum = val('curriculum').split('\n').filter(x => x.trim());
    } else if (currentTab === 'testimonials') {
        newItem.name = val('name');
        newItem.role = val('role');
        newItem.image = val('image');
        newItem.text = val('text');
        newItem.id = newItem.id || Date.now();
    } else if (currentTab === 'gallery') {
        newItem.caption = val('caption');
        newItem.imageUrl = val('imageUrl');
        newItem.category = val('category');
        newItem.id = newItem.id || Date.now();
    } else if (currentTab === 'events') {
        newItem.id = val('id');
        newItem.eventName = val('eventName');
        newItem.date = val('date');
        newItem.time = val('time');
        newItem.location = val('location');
        newItem.imageUrl = val('imageUrl');
        newItem.description = val('description');
    }

    if (editIndex >= 0) {
        currentData[editIndex] = newItem;
    } else {
        currentData.push(newItem);
    }

    await saveData();
    modalInstance.hide();
}

async function saveGeneral() {
    currentData.name = document.getElementById('gen-name').value;
    currentData.logo = document.getElementById('gen-logo').value;
    currentData.heroImage = document.getElementById('gen-hero').value;

    if (!currentData.about) currentData.about = {};
    currentData.about.image = document.getElementById('gen-about-img').value;
    currentData.about.content = document.getElementById('gen-about-content').value;

    if (!currentData.mission) currentData.mission = {};
    currentData.mission.image = document.getElementById('gen-mission-img').value;

    if (!currentData.vision) currentData.vision = {};
    currentData.vision.image = document.getElementById('gen-vision-img').value;

    if (!currentData.contact) currentData.contact = {};
    currentData.contact.phone = document.getElementById('gen-phone').value;
    currentData.contact.email = document.getElementById('gen-email').value;
    currentData.contact.address = document.getElementById('gen-address').value;
    currentData.contact.mapUrl = document.getElementById('gen-map').value;

    await saveData();
    alert('General Settings Updated Successfully!');
}

async function saveData() {
    const res = await sendData(currentTab, currentData);
    if (res.success) {
        loadData();
    } else {
        alert('Error saving data: ' + res.error);
    }
}
