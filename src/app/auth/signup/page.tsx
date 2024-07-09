"use client";
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import axios from 'axios';
import { Navbar } from '@/components/Navbar';
import { redirect } from 'next/navigation';

export default function Signup() {
    const [user, setUser] = useState<{ username: string; email: string } | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get('/api/auth/user');
                setUser(res.data);
            } catch (error: any) {
                console.error(error.response.data);
            }
        };

        fetchUser();
    }, []);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const { username, email, password } = formData;

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const res = await axios.post('/api/auth/signup', formData);
            console.log(res.data);
        } catch (error: any) {
            console.error(error.response.data);
        }
    };


    if (user) {
        redirect("/notes");
    }
    return (
        <div>
            <Navbar />
            <div className="min-h-[93vh] flex items-center justify-center bg-gray-100">
                <form onSubmit={onSubmit} className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                    <h2 className="text-4xl font-bold text-center mb-8">Sign Up</h2>
                    <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={onChange}
                        placeholder="Username"
                        className="block w-full p-2 mb-4 border rounded text-xl"
                    />
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        placeholder="Email"
                        className="block w-full p-2 mb-4 border rounded text-xl"
                    />
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        placeholder="Password"
                        className="block w-full p-2 mb-4 border rounded text-xl"
                    />
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded text-xl hover:bg-blue-700">
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
}
