export type ApiReservationDetails = {
  id: string;
  house: {
    id: string;
    hostEmailAddress: string;
  };
  startDate: string;
  endDate: string;
};
