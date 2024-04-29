document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('registration-form');
    const updateForm = document.getElementById('update-form');
    const deleteForm = document.getElementById('delete-form');
    const registrationsList = document.getElementById('registrations-list');
    const message = document.getElementById('message');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const requestData = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            const data = await response.json();
            message.textContent = data.message;
            form.reset();
            fetchRegistrationsList();
        } catch (error) {
            console.error('Error:', error);
            message.textContent = 'An error occurred. Please try again later.';
        }
    });

    updateForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(updateForm);
        const id = formData.get('id');

        try {
            const response = await fetch(`/registrations/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(Object.fromEntries(formData.entries()))
            });

            const data = await response.json();
            message.textContent = data.message;
            fetchRegistrationsList();
        } catch (error) {
            console.error('Error:', error);
            message.textContent = 'An error occurred. Please try again later.';
        }
    });

    deleteForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const id = document.getElementById('delete-id').value;

        try {
            const response = await fetch(`/registrations/${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();
            message.textContent = data.message;
            fetchRegistrationsList();
        } catch (error) {
            console.error('Error:', error);
            message.textContent = 'An error occurred. Please try again later.';
        }
    });

    function fetchRegistrationsList() {
        fetch('/registrations')
            .then(response => response.json())
            .then(data => {
                registrationsList.innerHTML = '';
                data.forEach(registration => {
                    const li = document.createElement('li');
                    li.textContent = `${registration.name} - ${registration.email} - ${registration.phone}`;
                    li.setAttribute('data-id', registration.id);
                    li.addEventListener('click', () => {
                        populateUpdateForm(registration);
                    });
                    registrationsList.appendChild(li);
                });
            })
            .catch(error => {
                console.error('Error:', error);
                message.textContent = 'An error occurred. Please try again later.';
            });
    }

    function populateUpdateForm(registration) {
        const { id, name, email, phone } = registration;
        document.getElementById('update-name').value = name;
        document.getElementById('update-email').value = email;
        document.getElementById('update-phone').value = phone;
        document.getElementById('delete-id').value = id;
    }

    fetchRegistrationsList();
});
