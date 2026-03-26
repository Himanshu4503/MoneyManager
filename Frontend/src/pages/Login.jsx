import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import Input from '../components/Input';
import axiosConfig from '../util/AxiosConfig';
import { API_ENDPOINTS } from '../util/apiEndpoints';
import { AppContext } from '../context/AppContext';
import { LoaderCircle } from 'lucide-react';
import { validateEmail } from '../util/validation';  // ⭐ ADDED THIS IMPORT

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useContext(AppContext);  // ⭐ FIXED: Changed from [setUser] to { setUser }

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // basic validation
    if (!validateEmail(email)) {
      setError("Please enter your email address");
      setIsLoading(false);
      return;
    }
    if (!password.trim()) {
      setError("Please enter your password");
      setIsLoading(false);
      return;
    }

    setError("");

    // Login api Call
    try {
      const response = await axiosConfig.post(API_ENDPOINTS.LOGIN, {
        email,
        password,
      });
      const { token, user } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        setUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      if(error.response && error.response.data.message){
        setError(error.response.data.message);
      }else{
        console.error("Something went wrong", error);
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="h-screen w-full relative flex items-center justify-center overflow-hidden">
      {/* Background image with blur */}
      <img
        src={assets.login_bg}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover filter blur-sm"
      />

      <div className="relative z-10 w-full max-w-lg px-6">
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-2xl p-8 max-h-[90] overflow-y-auto">
          <h3 className="text-2xl font-semibold text-black text-center mb-2">
            Welcome Back
          </h3>
          <p className="text-sm text-slate-700 text-center mb-8">
            Please enter your details to login in
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email"
              placeholder="name@example.com"
              type="email"
            />
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              placeholder="*******"
              type="password"
            />
            {error && (
              <p className="text-red-700 text-sm text-center bg-red-100 p-2 rounded-md">{error}</p>
            )}
            <button
              disabled={isLoading}
              type="submit"
              className={`w-full bg-purple-500 text-white py-3 text-lg font-medium rounded-md hover:bg-purple-600 transition-colors flex items-center justify-center gap-2 ${
                isLoading ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="animate-spin w-5 h-5" />
                  Logging in...
                </>
              ) : (
                "LOGIN"
              )}
            </button>

            <p className="text-sm text-slate-800 text-center mt-6">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-primary underline hover:text-primary-dark transition-colors">
                Signup
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login