export const SupportService = {
  submitTicket: async (data: { name: string; email: string; subject: string; message: string }) => {
    return { success: true, reference: `SUP-${Math.floor(1000 + Math.random() * 9000)}` };
  },
};

