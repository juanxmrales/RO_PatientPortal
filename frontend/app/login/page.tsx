'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('http://192.168.33.117:3001/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dni, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || 'Error en login');
      return;
    }

    localStorage.setItem('user', JSON.stringify(data.user));

    if (data.redirectUrl) {
      window.location.href = data.redirectUrl;
    } else {
      console.log(data);
      router.push('/admin');
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16 bg-card border-r border-border">
        <h1 className="text-2xl font-semibold mb-6">RO Patient Portal</h1>
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <div>
            <label className="text-sm block mb-1 text-muted-foreground">DNI</label>
            <Input
              type="text"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              placeholder="Ingrese su DNI"
              className="bg-input text-foreground border-border"
            />
          </div>
          <div>
            <label className="text-sm block mb-1 text-muted-foreground">Contraseña</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
              className="bg-input text-foreground border-border"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full">
            Iniciar sesión
          </Button>
          <div className="text-center">
            <a href="#" className="text-sm text-primary hover:underline">
              Cambiar contraseña
            </a>
          </div>
        </form>
      </div>
      <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('/hospital.jpg')" }} />
    </div>
  );
}
