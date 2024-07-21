import * as React from 'react';
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Dashboard from "@/app/main/page";
import SignInSide from "@/app/login/page";

const inter = Inter({ subsets: ['latin'] })

export default function MainPage() {
    return (
        <div>
            <SignInSide />
        </div>
    );
}