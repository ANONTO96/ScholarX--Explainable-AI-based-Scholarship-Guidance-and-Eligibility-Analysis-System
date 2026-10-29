
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ADMIN_SCHOLARSHIPS_URL = `${API_BASE_URL}/api/admin/scholarships`;
const SCHOLARSHIPS_URL = `${API_BASE_URL}/api/scholarships`;

const request = async (url, options = {}) => {
  if (!API_BASE_URL) {
    throw new Error(
      "VITE_API_BASE_URL is not configured in your frontend environment."
    );
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.detail ||
        errorData?.message ||
        `Request failed with status ${response.status}`
    );
  }

  if (response.status === 204) return null;

  return response.json();
};

// Fetch all scholarships for the management table.
export const getScholarships = async ({ signal } = {}) => {
  const result = await request(`${SCHOLARSHIPS_URL}/`, { signal });

  const records = Array.isArray(result)
    ? result
    : Array.isArray(result?.data)
      ? result.data
      : null;

  if (!records) {
    throw new Error(
      "Unexpected API response. Expected an array of scholarships or { data: [...] }."
    );
  }

  return records;
};

// Fetch one scholarship for the edit form.
export const getScholarshipById = (id) => {
  return request(`${SCHOLARSHIPS_URL}/${id}`);
};

// Create a scholarship.
export const createScholarship = (data) => {
  return request(`${ADMIN_SCHOLARSHIPS_URL}/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Update an existing scholarship.
export const updateScholarship = (id, data) => {
  return request(`${ADMIN_SCHOLARSHIPS_URL}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};
