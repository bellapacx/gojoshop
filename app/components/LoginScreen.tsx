"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Shield } from "react-feather";

interface LoginScreenProps {
  setCurrentUser: (user: User) => void;
  setCurrentView: (view: "login" | "dashboard") => void;
}

export interface User {
  name: string;
  role: string;
  shopId: string;
  permissions: string[];
  balance: number;
  token?: string; // optional now
}

export default function LoginScreen({
  setCurrentUser,
  setCurrentView,
}: LoginScreenProps) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    shopId: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Redirect if token already exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setCurrentView("dashboard");
  }, [setCurrentView]);

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setErrorMsg("");

  try {
    
    const response = await fetch("https://gojbingoapi.onrender.com/loginshop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shopId: credentials.shopId,
        username: credentials.username,
        password: credentials.password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Login failed");
    }

    const data = await response.json();
    const { token, user } = data;

    if (!user) throw new Error("Invalid response from server");

    // Save token and shopId
    localStorage.setItem("token", token || "");
    localStorage.setItem("shopid", credentials.shopId);

    // Pass user to parent
    setCurrentUser({ ...user, token }); // token is optional

    // Switch view
    setCurrentView("dashboard");
  } catch (err: unknown) {
    // Proper error handling for TypeScript
    if (err instanceof Error) {
      setErrorMsg(err.message || "Login failed");
    } else {
      setErrorMsg("Login failed");
    }
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 md:p-10 border border-slate-200">
        {/* Branding */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Gojo Bingo</h1>
          <p className="mt-1 text-sm text-slate-500">Shop Management Login</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-slate-700 font-medium mb-2">Shop ID</label>
            <input
              type="text"
              value={credentials.shopId}
              onChange={(e) =>
                setCredentials({ ...credentials, shopId: e.target.value })
              }
              placeholder="Enter your Shop ID"
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-md text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-2">Username</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
              placeholder="Username"
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-md text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-2">Password</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              placeholder="Password"
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-md text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
            />
          </div>

          {errorMsg && <p className="text-red-500 text-center font-medium">{errorMsg}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-slate-800 text-white font-semibold rounded-md hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Logging in...
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Security Footer */}
        <div className="mt-6 pt-6 border-t border-slate-200 text-xs text-slate-500 text-center space-y-2">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <CheckCircle size={16} className="mr-1 text-slate-400" />
              Secure Login
            </div>
            <div className="flex items-center">
              <Shield size={16} className="mr-1 text-slate-400" />
              Encrypted
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
