import { useState } from 'react';


export default function Login() {
const [email, setEmail] = useState('');
const [senha, setSenha] = useState('');


const handleLogin = () => {
fetch('/api/login', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ email, senha })
});
};


return (
<div>
<h2>Login</h2>
<input placeholder="Email" onChange={e => setEmail(e.target.value)} />
<input placeholder="Senha" type="password" onChange={e => setSenha(e.target.value)} />
<button onClick={handleLogin}>Entrar</button>
</div>
);
}