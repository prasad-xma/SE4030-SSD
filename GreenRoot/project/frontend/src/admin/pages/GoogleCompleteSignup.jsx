import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { setAuthUser } from "@/Common/authSession";

const API_URL = "http://localhost:3000/api/auth/google/signup";

const GoogleCompleteSignup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    axios
      .get(API_URL, { withCredentials: true })
      .then((res) => {
        const { email, firstName, lastName } = res.data.data;
        setEmail(email);
        setForm((current) => ({ ...current, firstName, lastName }));
        setLoading(false);
      })
      .catch(() => navigate("/auth/login?error=google_signup_expired"));
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(form.phone)) {
      Swal.fire({ title: "Phone number must contain exactly 10 digits!", icon: "error" });
      return;
    }

    try {
      const res = await axios.post(API_URL, form, { withCredentials: true });
      setAuthUser(res.data.data);
      navigate("/auth/google/success");
    } catch (error) {
      const data = error.response?.data || {};
      Swal.fire({
        title: "Sign up failed",
        text: data.err || "Please try again later.",
        icon: "error",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white shadow rounded-lg p-8 space-y-5">
        <h1 className="text-2xl font-semibold text-gray-800">Complete your account</h1>
        <p className="text-gray-500">
          You are signing up with Google as <span className="font-medium text-gray-800">{email}</span>.
          Please add your phone number and address to finish.
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm text-gray-700">Phone Number</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="07XXXXXXXX"
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm text-gray-700">Address</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 font-semibold text-white bg-green-500 rounded-lg hover:bg-green-700"
        >
          Create account
        </button>
      </form>
    </div>
  );
};

export default GoogleCompleteSignup;
