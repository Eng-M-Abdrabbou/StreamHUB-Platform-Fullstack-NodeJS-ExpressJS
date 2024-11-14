
console.log('Script loaded');

document.addEventListener('DOMContentLoaded', function () {
    fetchAllData();
    setupEditFunctionality();
});

document.querySelector('table tbody').addEventListener('click', function(event) {
    try {
        console.log('Table body clicked, event target:', event.target);
        if (event.target.className === "delete-row-btn") {
            deleteRowById(event.target.dataset.id);
        }
        if (event.target.className === "edit-row-btn") {
            console.log('Edit button clicked, id:', event.target.dataset.id);
            handleEditRow(event.target.dataset.id);
        }
    } catch (error) {
        console.error('Error in table body click event:', error);
    }
});


console.log('Table body:', document.querySelector('table tbody'));

const updateBtn = document.querySelector('#update-row-btn');
const searchBtn = document.querySelector('#search-btn');
const addBtn = document.querySelector('#add-name-btn');

function fetchAllData() {
    fetch('http://localhost:8000/getAll')
    .then(response => response.json())
    .then(data => {
        console.log('Data received from server:', data);
        inspectData(data);
        loadHTMLTable(data.data || data);
    })
    .catch(error => console.error('Error fetching data:', error));
}

//

function setupEditFunctionality() {
    console.log('Setting up edit functionality');

    function handleEditRow(id) {
        console.log('handleEditRow function started with id:', id);
        const updateSection = document.querySelector('#update-row');
        console.log('Update section:', updateSection);
        
        if (!updateSection) {
            console.error('Update section not found in the DOM');
            return;
        }

        updateSection.style.display = 'block';
        console.log('Update section display style set to block');

        const updateFNameInput = document.querySelector('#update-fname-input');
        if (!updateFNameInput) {
            console.error('Update first name input not found');
            return;
        }
        updateFNameInput.dataset.id = id;
        console.log('ID set on first name input:', id);
        
        console.log('Fetching data for user with ID:', id);
        fetch(`http://localhost:8000/get/${id}`)
            .then(response => {
                console.log('Fetch response:', response);
                return response.json();
            })
            .then(data => {
                console.log('Fetched data:', data);
                if (data.success) {
                    const user = data.data;
                    document.querySelector('#update-fname-input').value = user.fName || '';
                    document.querySelector('#update-lname-input').value = user.lName || '';
                    document.querySelector('#update-email-input').value = user.email || '';
                    document.querySelector('#update-password-input').value = user.password || '';
                    
                    updateSection.scrollIntoView({ behavior: 'smooth' });
                    console.log('Form populated and scrolled into view');
                } else {
                    console.error('Data fetch unsuccessful:', data);
                }
            })
            .catch(error => {
                console.error('Error in fetch operation:', error);
            });
    }

    // Add event listener to table body
    const tableBody = document.querySelector('table tbody');
    if (tableBody) {
        tableBody.addEventListener('click', function(event) {
            if (event.target.className === "edit-row-btn") {
                console.log('Edit button clicked, id:', event.target.dataset.id);
                handleEditRow(event.target.dataset.id);
            }
        });
        console.log('Edit event listener attached to table body');
    } else {
        console.error('Table body not found in the DOM');
    }
}

// Call this function after your DOM is loaded
document.addEventListener('DOMContentLoaded', setupEditFunctionality);

//


searchBtn.onclick = function() {
    const fNameInput = document.querySelector('#fname-search-input');
    const lNameInput = document.querySelector('#lname-search-input');
    const fName = fNameInput.value;
    const lName = lNameInput.value;

    fetch(`http://localhost:8000/search/${fName}/${lName}`)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}

function handleEditRow(id) {
    try {
        console.log('handleEditRow function started');
        const updateSection = document.querySelector('#update-row');
        console.log('Update section:', updateSection);
        
        if (!updateSection) {
            throw new Error('Update section not found in the DOM');
        }

        updateSection.style.display = 'block';
        console.log('Update section display style set to block');

        const updateFNameInput = document.querySelector('#update-fname-input');
        if (!updateFNameInput) {
            throw new Error('Update first name input not found');
        }
        updateFNameInput.dataset.id = id;
        console.log('ID set on first name input:', id);
        
        console.log('Fetching data for user with ID:', id);
        fetch(`http://localhost:8000/get/${id}`)
            .then(response => {
                console.log('Fetch response:', response);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Fetched data:', data);
                if (data.success) {
                    const user = data.data;
                    document.querySelector('#update-fname-input').value = user.fName || '';
                    document.querySelector('#update-lname-input').value = user.lName || '';
                    document.querySelector('#update-email-input').value = user.email || '';
                    document.querySelector('#update-password-input').value = user.password || '';
                    
                    updateSection.scrollIntoView({ behavior: 'smooth' });
                    console.log('Form populated and scrolled into view');
                } else {
                    throw new Error('Data fetch unsuccessful: ' + JSON.stringify(data));
                }
            })
            .catch(error => {
                console.error('Error in fetch operation:', error);
                alert('Failed to load user data. Please try again.');
            });
    } catch (error) {
        console.error('Error in handleEditRow function:', error);
        alert('An error occurred while trying to edit the row. Please check the console for more details.');
    }
}

function deleteRowById(id) {
    fetch('http://localhost:8000/delete/' + id, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            fetchAllData();
        }
    });
}


function highlightUpdatedRow(id) {
    const row = document.querySelector(`tr[data-id="${id}"]`);
    if (row) {
        row.style.backgroundColor = '#ffffcc';
        setTimeout(() => {
            row.style.backgroundColor = '';
        }, 3000);
    }
}

document.querySelector('#update-row-btn').onclick = function() {
    const updateFNameInput = document.querySelector('#update-fname-input');
    const updateLNameInput = document.querySelector('#update-lname-input');
    const updateEmailInput = document.querySelector('#update-email-input');
    const updatePasswordInput = document.querySelector('#update-password-input');

    const id = updateFNameInput.dataset.id;

    fetch('http://localhost:8000/update', {
        method: 'PATCH',
        headers: {
            'Content-type' : 'application/json'
        },
        body: JSON.stringify({
            id: id,
            fName: updateFNameInput.value,
            lName: updateLNameInput.value,
            email: updateEmailInput.value,
            password: updatePasswordInput.value
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            fetchAllData();
            document.querySelector('#update-row').hidden = true;
            highlightUpdatedRow(id);
            alert('Update successful!');
        } else {
            alert('Update failed. Please try again.');
        }
    })
}

updateBtn.onclick = function() {
    const updateFNameInput = document.querySelector('#update-fname-input');
    const updateLNameInput = document.querySelector('#update-lname-input');
    const updateEmailInput = document.querySelector('#update-email-input');
    const updatePasswordInput = document.querySelector('#update-password-input');

    fetch('http://localhost:8000/update', {
        method: 'PATCH',
        headers: {
            'Content-type' : 'application/json'
        },
        body: JSON.stringify({
            id: updateFNameInput.dataset.id,
            fName: updateFNameInput.value,
            lName: updateLNameInput.value,
            email: updateEmailInput.value,
            password: updatePasswordInput.value
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            fetchAllData();
            document.querySelector('#update-row').hidden = true;
        }
    })
}

function handleEditRow(id) {
    const updateSection = document.querySelector('#update-row');
    updateSection.hidden = false;
    document.querySelector('#update-fname-input').dataset.id = id;
    
    // Fetch the current data for the row
    fetch(`http://localhost:8000/get/${id}`)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const user = data.data;
            document.querySelector('#update-fname-input').value = user.fName;
            document.querySelector('#update-lname-input').value = user.lName;
            document.querySelector('#update-email-input').value = user.email;
            document.querySelector('#update-password-input').value = user.password;
        }
    });
}

addBtn.onclick = function () {
    const fNameInput = document.querySelector('#fname-input');
    const lNameInput = document.querySelector('#lname-input');
    const emailInput = document.querySelector('#email-input');
    const passwordInput = document.querySelector('#password-input');

    const fName = fNameInput.value.trim();
    const lName = lNameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!fName || !lName || !email || !password) {
        alert('Please fill in all fields');
        return;
    }

    console.log('Sending data:', { fName, lName, email, password });

    fetch('http://localhost:8000/insert', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ fName, lName, email, password })
    })
    .then(response => {
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`HTTP error! status: ${response.status}, message: ${text}`);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Server response:', data);
        if (data.success) {
            insertRowIntoTable(data.data);
            fNameInput.value = "";
            lNameInput.value = "";
            emailInput.value = "";
            passwordInput.value = "";
            alert('User added successfully!');
        } else {
            throw new Error(data.message || 'Unknown error occurred');
        }
    })
    .catch(error => {
        console.error('Error details:', error);
        alert(`Failed to add user. Error: ${error.message}`);
    });
}

function insertRowIntoTable(data) {
    const table = document.querySelector('table tbody');
    const isTableData = table.querySelector('.no-data');

    let tableHtml = "<tr>";

    tableHtml += `<td>${data.id || ''}</td>`;
    tableHtml += `<td>${data.fName || ''}</td>`;
    tableHtml += `<td>${data.lName || ''}</td>`;
    tableHtml += `<td>${data.email || ''}</td>`;
    tableHtml += `<td>${data.password || ''}</td>`;
    tableHtml += `<td><button class="delete-row-btn" data-id=${data.id}>Delete</td>`;
    tableHtml += `<td><button class="edit-row-btn" data-id=${data.id}>Edit</td>`;

    tableHtml += "</tr>";

    if (isTableData) {
        table.innerHTML = tableHtml;
    } else {
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
    }

    // Refresh the table to ensure correct ordering
    fetchAllData();
}


function loadHTMLTable(data) {
    const table = document.querySelector('table tbody');

    if (!data || data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='6'>No Data</td></tr>";
        return;
    }

    let tableHtml = "";

    data.forEach(function (item) {
        console.log('Row data:', item);
        const id = item.id || item[' ld'] || 'N/A';
        const fName = item.fName || item[' fName'] || 'N/A';
        const lName = item.lName || item[' IName'] || item.IName || 'N/A';
        const email = item.email || item.Email || 'N/A';
        const password = item.password || item.Password || 'N/A';

        tableHtml += "<tr>";
        tableHtml += `<td>${id}</td>`;
        tableHtml += `<td>${fName}</td>`;
        tableHtml += `<td>${lName}</td>`;
        tableHtml += `<td>${email}</td>`;
        tableHtml += `<td>${password}</td>`;
        tableHtml += `<td><button class="delete-row-btn" id="myButton" data-id=${id}>Delete</td>`;
        tableHtml += `<td><button class="edit-row-btn" id="myButton" data-id=${id}>Edit</td>`;
        tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
}

// Add this function to help debug
function inspectData(data) {
    console.log('Data type:', typeof data);
    console.log('Is array:', Array.isArray(data));
    if (Array.isArray(data) && data.length > 0) {
        console.log('First item keys:', Object.keys(data[0]));
    } else if (typeof data === 'object' && data.data && Array.isArray(data.data) && data.data.length > 0) {
        console.log('First item keys:', Object.keys(data.data[0]));
    }
    console.log('Stringified data:', JSON.stringify(data, null, 2));
}

// Call this function in fetchAllData
function fetchAllData() {
    fetch('http://localhost:8000/getAll')
    .then(response => response.json())
    .then(data => {
        console.log('Data received from server:', data);
        inspectData(data['data']); // Add this line
        loadHTMLTable(data['data']);
    })
    .catch(error => console.error('Error fetching data:', error));
}

