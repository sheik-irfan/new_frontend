// src/models/WalletModel.js
 
export const createWalletModel = (data) => {
    return {
      walletId: data.walletId,
      userId: data.userId,
      balance: data.balance,
    };
  };