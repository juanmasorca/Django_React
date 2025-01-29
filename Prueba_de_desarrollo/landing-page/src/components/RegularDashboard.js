import React, { useState } from 'react';

function RegularDashboard() {
    const [message, setMessage] = useState('');

    const handleButtonClick = (buttonNumber) => {
        fetch('http://localhost:8000/core/update/click/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `token ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ button_number: buttonNumber }),
        })
        .then(response => response.json())
        .then(data => setMessage(data.message))
        .catch(error => console.error('Error updating click:', error));
    };

    return (
        <div>
            <h2>Bienvenido a la Landing Page</h2>
            <p>{message}</p>
            <button onClick={() => handleButtonClick(1)}>Botón 1</button>
            <button onClick={() => handleButtonClick(2)}>Botón 2</button>
        </div>
    );
}

export default RegularDashboard;
