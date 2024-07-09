"use client"
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import axios from 'axios';
import { Navbar } from '@/components/Navbar';
import { redirect } from 'next/navigation';

export default function Signin() {
    const [user, setUser] = useState<{ username: string; email: string } | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get('/api/auth/user');
                setUser(res.data);
            } catch (error) {
                console.error(error.response.data);
            }
        };

        fetchUser();
    }, []);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const res = await axios.post('/api/auth/signin', formData);
            window.location.replace("/notes");
        } catch (error) {
            console.error(error);
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
                    <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Sign In</h2>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        placeholder="Email"
                        className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        placeholder="Password"
                        className="block w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}