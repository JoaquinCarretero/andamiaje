import fetch from 'node-fetch'; // si no lo tenés: npm i node-fetch

const testRegister = async () => {
  try {
    const res = await fetch('https://andamiaje-api.onrender.com/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'User',
        email: 'test1@example.com',
        phone: '123456789',
        documentNumber: '12345678',
        password: '123456',
        role: 'terapeuta' // <--- en minúsculas
      })
    });
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Data:', data);
  } catch (err) {
    console.error('Error:', err);
  }
};

testRegister();
