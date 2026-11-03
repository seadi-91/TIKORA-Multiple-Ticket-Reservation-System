export const RefundService = {
  requestRefund: async (bookingId: string, reason: string) => {
    return { success: true, bookingId, status: "SUBMITTED" };
  },
};

