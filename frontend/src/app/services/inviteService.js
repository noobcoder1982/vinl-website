const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const VITE_API_URL = import.meta.env.VITE_API_URL || (isLocalhost ? "http://localhost:5001/api" : "https://vinl-website.onrender.com/api");
const API_URL = `${VITE_API_URL.replace(/\/$/, "")}/invites`;

class InviteService {
  async sendInvite(toUsername, roomCode, type = 'blend') {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.token) return { success: false, message: "Not authenticated" };

    try {
      const response = await fetch(`${API_URL}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ toUsername, roomCode, type })
      });
      return await response.json();
    } catch (err) {
      console.error("Invite Error:", err);
      return { success: false, message: err.message };
    }
  }

  async getMyInvites() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.token) return [];

    try {
      const response = await fetch(`${API_URL}/my`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const data = await response.json();
      return (data.data || []).map(i => ({ ...i, received: true }));
    } catch (err) {
      console.error("Fetch Invites Error:", err);
      return [];
    }
  }

  async getSentInvites() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.token) return [];

    try {
      const response = await fetch(`${API_URL}/sent`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const data = await response.json();
      return (data.data || []).map(i => ({ ...i, received: false }));
    } catch (err) {
      console.error("Fetch Sent Error:", err);
      return [];
    }
  }

  async updateInviteStatus(inviteId, status) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.token) return { success: false };

    try {
      const response = await fetch(`${API_URL}/${inviteId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      return await response.json();
    } catch (err) {
      console.error("Update Invite Error:", err);
      return { success: false };
    }
  }

  async deleteInvite(inviteId) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.token) return;

    try {
      await fetch(`${API_URL}/${inviteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
    } catch (err) {
      console.error("Delete Invite Error:", err);
    }
  }
}

export const inviteService = new InviteService();
