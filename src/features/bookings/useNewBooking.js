import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBooking as createBookingAPI } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useNewBooking() {
  const queryClient = useQueryClient();
  const { isLoading, mutate: createBooking } = useMutation({
    mutationFn: createBookingAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("New booking succesfully created 👍🏻");
    },
    onError: (err) => {
      console.log("ERROR", err);
      toast.error(err.message);
    },
  });

  return { isLoading, createBooking };
}
