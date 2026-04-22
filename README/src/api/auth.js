const BASE_URL = "https://nadamomen26-users.hf.space";

// REGISTER
export const registerUser = async (userData) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const text = await res.text(); // 👈 بدل json مباشرة

  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error(text); // backend error message
  }

  if (!res.ok) {
    throw new Error(data.message || "Register failed");
  }

  return data;
};

// LOGIN
export const loginUser = async (userData) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};