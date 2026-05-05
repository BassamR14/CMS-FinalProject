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
    const res = await axios.get(
      API_URL +
        "/users/me?populate[to_read][populate]=cover&populate[ratings][populate][book][populate]=cover",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getBooks() {
  try {
    const res = await axios.get(
      API_URL + "/books?populate[cover]=true&populate[ratings]=true",
    );
    return res.data.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getBook(documentId) {
  try {
    const res = await axios.get(
      API_URL +
        `/books/${documentId}?populate[cover]=true&populate[ratings]=true`,
    );
    return res.data.data;
  } catch (err) {}
}

export async function saveBook(bookDocumentId) {
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

    return res.data;
  } catch (err) {
    console.log("Save failed:", err.response?.data?.error?.message || err);
  }
}

export async function removeBook(bookDocumentId) {
  try {
    const token = localStorage.getItem("token");
    const user = await getMe();

    const res = await axios.put(
      API_URL + `/books/${bookDocumentId}`,
      {
        data: {
          saved_by: {
            disconnect: [user.id],
          },
        },
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return res.data;
  } catch (err) {
    console.log("Remove failed:", err.response?.data?.error?.message || err);
  }
}

export async function getSettings() {
  const res = await axios.get(API_URL + "/site-setting");
  return res.data.data;
}

export async function rateBook(bookDocumentId, user, value) {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      API_URL + "/ratings",
      {
        data: {
          value,
          book: bookDocumentId,
          user: user.id,
        },
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return res.data;
  } catch (err) {
    console.log("Rating failed:", err.response?.data?.error?.message || err);
  }
}

export async function updateRating(ratingDocumentId, value) {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.put(
      API_URL + `/ratings/${ratingDocumentId}`,
      {
        data: { value },
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return res.data;
  } catch (err) {
    console.log(
      "Updating rating failed:",
      err.response?.data?.error?.message || err,
    );
  }
}

export async function uploadImage(imgData) {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(API_URL + "/upload", imgData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (err) {
    console.log(
      "Uploading image failed:",
      err.response?.data?.error?.message || err,
    );
  }
}

export async function createBook(newBook) {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      API_URL + "/books",
      { data: newBook },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return res.data;
  } catch (err) {
    console.log(
      "Adding book failed:",
      err.response?.data?.error?.message || err,
    );
  }
}
