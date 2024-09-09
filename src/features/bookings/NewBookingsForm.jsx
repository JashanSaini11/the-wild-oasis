import styled from "styled-components";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import { useCabins } from "../cabins/usecabins";
import Spinner from "../../ui/Spinner";
import Checkbox from "../../ui/Checkbox";
import Button from "../../ui/Button";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { differenceInDays, isBefore, isDate, startOfToday } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useSettings } from "../settings/useSettings";
import toast from "react-hot-toast";
import { useGuests } from "../../hooks/useGuest";
import { useNewBooking } from "./useNewBooking";

const StyledSelect = styled.select`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);
`;

function NewBookingForm({ onCloseModal }) {
  const [wantsBreakfast, setWantsBreakfast] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const { cabins, isLoading } = useCabins();
  const { guests, isLoading: isLoadingGuests } = useGuests();
  const { settings, isLoading: isLoadingSettings } = useSettings();
  const { createBooking, isLoading: isCreating } = useNewBooking();

  // Updated usage
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },

    reset,
  } = useForm();

  if (isLoading || isLoadingSettings || isLoadingGuests) return <Spinner />;

  function onSubmit(data) {
    const numNights = differenceInDays(
      new Date(data.endDate),
      new Date(data.startDate)
    );
    const today = startOfToday();

    // Validation
    if (numNights < 1) {
      toast.error("Start date must be before end date");
      return;
    }
    if (numNights < settings.minBookingLength) {
      toast.error(
        `Minimum nights per booking are ${settings.minBookingLength}`
      );
      return;
    }
    if (numNights > settings.maxBookingLength) {
      toast.error(
        `Maximum nights per booking are ${settings.maxBookingLength}`
      );
      return;
    }
    if (isBefore(new Date(data.startDate), today)) {
      toast.error("You can't start a booking before today");
      return;
    }

    // Cabin Price Calculation
    const reservedCabin = cabins.find(
      (cabin) => cabin.id === Number(data.cabinId)
    );
    if (!reservedCabin) {
      toast.error("Selected cabin does not exist.");
      return;
    }
    const cabinPrice =
      (reservedCabin.regularPrice - reservedCabin.discount) * numNights;

    // Extras Price Calculation
    const extrasPrice = wantsBreakfast
      ? settings.breakfastPrice * numNights * data.numGuests
      : 0;

    // Total Price
    const totalPrice = cabinPrice + extrasPrice;

    // Final Data Preparation
    const finalData = {
      ...data,
      cabinPrice,
      extrasPrice,
      totalPrice,
      isPaid,
      numNights,
      cabinId: Number(data.cabinId),
      numGuests: Number(data.numGuests),
      guestId: Number(data.guestId),
      hasBreakfast: wantsBreakfast,
      status: "unconfirmed",
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
    };

    createBooking(finalData, {
      onSuccess: () => {
        reset();
        onCloseModal?.();
        navigate(`/bookings`);
      },
      onError: () => {
        toast.error("Failed to create booking. Please try again.");
      },
    });
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow
        label="Start date"
        htmlFor="startDate"
        error={errors?.startDate?.message}
      >
        <Input
          disabled={isCreating}
          type="date"
          id="startDate"
          {...register("startDate", {
            required: "This field is required",
            validate: (value) =>
              isDate(new Date(value)) || "You must choose a valid date",
          })}
        />
      </FormRow>
      <FormRow
        label="End date"
        htmlFor="endDate"
        error={errors?.endDate?.message}
      >
        <Input
          disabled={isCreating}
          type="date"
          id="endDate"
          {...register("endDate", {
            required: "This field is required",
            validate: (value) =>
              isDate(new Date(value)) || "You must choose a valid date",
          })}
        />
      </FormRow>
      <FormRow
        label="Number of guests"
        htmlFor="numGuests"
        error={errors?.numGuests?.message}
      >
        <Input
          disabled={isCreating}
          type="number"
          min={1}
          defaultValue={1}
          id="numGuests"
          {...register("numGuests", {
            required: "This field is required",
            min: {
              value: 1,
              message: "Minimum number of guests must be 1",
            },
            max: {
              value: settings.maxGuestsPerBooking,
              message: `Max number of guests must be ${settings.maxGuestsPerBooking}`,
            },
          })}
        />
      </FormRow>
      <FormRow
        label="Select cabin"
        htmlFor="cabinId"
        error={errors?.cabinId?.message}
      >
        <StyledSelect
          disabled={isCreating}
          id="cabinId"
          {...register("cabinId", { required: "Please select a cabin." })}
        >
          <option value="">-- Select a Cabin --</option>
          {cabins.map((cabin) => (
            <option key={cabin.id} value={cabin.id}>
              {cabin.name}
            </option>
          ))}
        </StyledSelect>
      </FormRow>
      <FormRow
        label="Select guest"
        htmlFor="guestId"
        error={errors?.guestId?.message}
      >
        <StyledSelect
          disabled={isCreating}
          id="guestId"
          {...register("guestId", { required: "Please select a guest." })}
        >
          <option value="">-- Select a Guest --</option>
          {guests.map((guest) => (
            <option key={guest.id} value={guest.id}>
              {guest.fullName}
            </option>
          ))}
        </StyledSelect>
      </FormRow>
      <FormRow label="Further observations" htmlFor="observations">
        <Input
          type="text"
          id="observations"
          disabled={isCreating}
          {...register("observations")}
        />
      </FormRow>
      <FormRow>
        <Checkbox
          id="breakfast"
          onChange={() => setWantsBreakfast((prev) => !prev)}
          checked={wantsBreakfast}
          disabled={isCreating}
        >
          I want breakfast with my booking
        </Checkbox>
      </FormRow>
      <FormRow>
        <Checkbox
          id="paid"
          onChange={() => setIsPaid((prev) => !prev)}
          checked={isPaid}
          disabled={isCreating}
        >
          This booking is paid
        </Checkbox>
      </FormRow>
      <FormRow>
        <Button type="submit" variation="primary" disabled={isCreating}>
          Submit
        </Button>
        <Button
          type="button"
          variation="secondary"
          disabled={isCreating}
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
      </FormRow>
    </Form>
  );
}

export default NewBookingForm;
