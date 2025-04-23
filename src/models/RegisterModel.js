// src/models/RegisterModel.js
export const buildRegisterPayload = (form) => {
    return {
      userName: form.userName,
      userEmail: form.userEmail,
      userPassword: form.userPassword,
      userGender: form.userGender,
      userRole: form.userRole || "CUSTOMER",
    };
  };