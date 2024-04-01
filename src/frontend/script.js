document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registration-form');
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
        } catch (error) {
            console.error('Error:', error);
            message.textContent = 'An error occurred. Please try again later.';
        }
    });
});
