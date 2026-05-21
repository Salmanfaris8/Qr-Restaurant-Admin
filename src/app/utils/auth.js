export const getValidAuth = () => {
  try {
    // Check for separate keys (what the backend actually creates)
    const token = localStorage.getItem("token");
    const admin = localStorage.getItem("admin");
    const expiresAt = localStorage.getItem("token_expires_at");

    if (!token || !admin || !expiresAt) {
      clearAuth();
      return null;
    }

    // Check if token expired (expiresAt is ISO string)
    if (new Date() > new Date(expiresAt)) {
      clearAuth();
      return null;
    }

    // Return combined auth object for backward compatibility
    return {
      token,
      admin: JSON.parse(admin),
      expiresAt,
    };
  } catch (error) {
    console.error("Auth validation error:", error);
    clearAuth();
    return null;
  }
};

// Utility to clear auth
const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("admin");
  localStorage.removeItem("token_expires_at");
};