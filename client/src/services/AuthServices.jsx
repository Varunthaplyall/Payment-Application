import axios from "axios";

const Signup = async (userDetails) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_AUTH_URL}api/v1/auth/register`,
      userDetails
    );
    if (res.status == 201) {
      return { success: true, data: res.data };
    }
  } catch (error) {
    return { success: false, error: error.response?.data?.message };
  }
};

const OtpVerification = async (OTP, userId) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_AUTH_URL}api/v1/auth/verify-otp`,
      { otp: OTP, userId }
    );
    if (res.status == 200) {
      return { success: true, data: res.data };
    }
  } catch (error) {
    return { success: false, error: error.response?.data?.message };
  }
};

const Login = async (phone) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_AUTH_URL}api/v1/auth/login`,
      { phone }
    );
    if (res.status == 200) {
      return { success: true, data: res.data };
    }
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message ||
        "Something went wrong, please try again",
    };
  }
};

const AuthServices = {
  Signup,
  OtpVerification,
  Login,
};

export default AuthServices;
