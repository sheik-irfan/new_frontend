// src/models/LoginModel.js
export const createUserFromToken = (decodedToken, fallbackEmail, fallbackRole, fallbackId) => {
    return {
      userEmail: decodedToken.sub || fallbackEmail,
      userRole: decodedToken.role || fallbackRole,
      userId: decodedToken.userId || fallbackId,
    };
  };