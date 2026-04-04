// Get the base API URL based on the current environment
const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const BACKEND_HOST = isLocalhost ? "localhost" : window.location.hostname;
const API_URL = `http://${BACKEND_HOST}:5001/api/users`;

class AuthService {
  logError(error, context = "Network") {
    const timestamp = new Date().toLocaleTimeString();
    console.error(`[${timestamp}] ${context} Failure:`, error);
  }

  /**
   * Login user with email and password.
   */
  async login(email, password) {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message || "Invalid email or password");

      localStorage.setItem("user", JSON.stringify(data.data));
      return { success: true, user: data.data };
    } catch (error) {
      this.logError(error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Signup new user.
   */
  async signup(name, email, password) {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: name.trim(), 
          email: email.trim(), 
          password 
        }),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message || "Registration failed");

      localStorage.setItem("user", JSON.stringify(data.data));
      return { success: true, user: data.data };
    } catch (error) {
      this.logError(error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Logout user.
   */
  async logout() {
    localStorage.removeItem("user");
    return { success: true };
  }

  /**
   * Update user profile.
   */
  async updateProfile(profileData) {
    try {
      const user = this.getCurrentUser();
      const response = await fetch(`${API_URL}/profile`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.token}`
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message || "Update failed");

      localStorage.setItem("user", JSON.stringify(data.data));
      return { success: true, user: data.data };
    } catch (error) {
      this.logError(error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Delete user account.
   */
  async deleteAccount() {
    try {
      const user = this.getCurrentUser();
      const response = await fetch(`${API_URL}/profile`, {
        method: "DELETE",
        headers: { 
          "Authorization": `Bearer ${user?.token}`
        },
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message || "Deletion failed");

      this.logout();
      return { success: true };
    } catch (error) {
      this.logError(error, "Account Deletion");
      return { success: false, message: error.message };
    }
  }

  /**
   * Get currently logged in user.
   */
  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  /* --- Social Methods --- */

  async getUsers() {
    const user = this.getCurrentUser();
    if (!user || !user.token) return [];
    try {
       const resp = await fetch(`${API_URL}`, {
         method: "GET",
         headers: { Authorization: `Bearer ${user.token}` }
       });
       const data = await resp.json();
       return data.data || [];
    } catch (err) {
       this.logError(err, "Get Users");
       return [];
    }
  }

  async followUser(userId) {
    const user = this.getCurrentUser();
    if (!user || !user.token) return;
    const resp = await fetch(`${API_URL}/follow/${userId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${user.token}` }
    });
    return await resp.json();
  }

  async unfollowUser(userId) {
    const user = this.getCurrentUser();
    if (!user || !user.token) return;
    const resp = await fetch(`${API_URL}/unfollow/${userId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${user.token}` }
    });
    return await resp.json();
  }
}

export const authService = new AuthService();
