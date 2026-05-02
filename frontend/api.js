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
    return res.data;
  } catch (error) {
    return { error: error.response?.data?.error?.message || "Login failed" };
  }
}

export function logout() {
  localStorage.removeItem("token");
}

export async function getMe() {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.get(API_URL + "/users/me?populate=*", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getBooks() {
  try {
    const res = await axios.get(API_URL + "/books?populate=*");
    return res.data.data;
  } catch (err) {
    console.log(err);
  }
}

export async function saveBook(bookDocumentId, bookId) {
  try {
    const token = localStorage.getItem("token");
    const user = await getMe();

    const alreadySaved = user.to_read.some(
      (b) => b.documentId === bookDocumentId,
    );
    if (alreadySaved) {
      console.log("Already in reading list");
      return;
    }

    const res = await axios.put(
      API_URL + `/books/${bookDocumentId}`,
      {
        data: {
          saved_by: {
            connect: [user.id],
          },
        },
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    console.log("Book saved!", res.data);
    return res.data;
  } catch (err) {
    console.log("Save failed:", err.response?.data?.error?.message || err);
  }
}
