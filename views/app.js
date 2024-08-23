document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-input');
    const uploadForm = document.getElementById('upload-form');
    const predictionResult = document.getElementById('prediction-result');
    const classNameElement = document.getElementById('class-name');
    const confidenceElement = document.getElementById('confidence');

    uploadForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const file = fileInput.files[0];

        if (!file) {
            alert('Please select a file!');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:5000/predict', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            classNameElement.textContent = `Class: ${data.class_name}`;
            confidenceElement.textContent = `Confidence: ${data.confidence}`;
            predictionResult.style.display = 'block';
        } catch (error) {
            console.error('There was an error!', error);
        }
    });
});
