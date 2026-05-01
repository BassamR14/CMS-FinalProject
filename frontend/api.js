const API_URL = "http://localhost:1337/api";

export async function register(username, email, password) {
  try {
    const res = await axios.post(API_URL + "/auth/local/register", {
      username,
      email,
      password,
    });

    localStorage.setItem("token", res.data.jwt);
  } catch (err) {
    console.log(err);
  }
}

export async function login(identifier, password) {
  try {
    const res = await axios.post(API_URL + "/auth/local", {
      identifier,
      password,
    });

    localStorage.setItem("token", res.data.jwt);
  } catch (err) {
    console.log(err);
  }
}

export function logout() {
  localStorage.removeItem("token");
}

export async function getMe() {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.get(API_URL + "/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}
