

export const validatePassengerDetails = (passengerDetails) => {
    for (let [i, passenger] of passengerDetails.entries()) {
      if (!passenger.name || !passenger.age || !passenger.gender) {
        return `❗ Please fill all fields for Passenger ${i + 1}`;
      }
    }
    return true;
  };
  
  export const mapPassengerDetails = (passengerDetails) => {
    return passengerDetails.map((p) => ({
      passengerName: p.name,
      passengerAge: parseInt(p.age),
      passengerGender: p.gender,
    }));
  };
  