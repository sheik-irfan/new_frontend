// src/components/AirportAutocomplete.js
import React, { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const AirportAutocomplete = ({ label, onSelect, onSearch, airports }) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (inputValue) onSearch(inputValue);
  }, [inputValue]);

  return (
    <Autocomplete
      options={airports}
      getOptionLabel={(option) => `${option.name} (${option.code}) - ${option.city}`}
      onInputChange={(e, newVal) => setInputValue(newVal)}
      onChange={(e, newVal) => onSelect(newVal)}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
};

export default AirportAutocomplete;
