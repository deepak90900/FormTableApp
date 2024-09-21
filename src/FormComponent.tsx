import React, { useState } from "react";
import {
  TextField,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
} from "@mui/material";

// Type definition for form data
interface FormData {
  name: string;
  age: number;
  gender: string;
  role: string;
}

interface FormComponentProps {
  onSubmitForm: (data: FormData) => void;
}

const FormComponent: React.FC<FormComponentProps> = ({ onSubmitForm }) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">(""); // Handle both number and empty string
  const [gender, setGender] = useState("male");
  const [role, setRole] = useState("admin");

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || age === "") {
      alert("Please fill all required fields");
      return;
    }

    // Ensure age is not negative
    if (Number(age) < 0) {
      alert("Age cannot be negative");
      return;
    }

    // Submit form data
    onSubmitForm({ name, age: Number(age), gender, role });

    // Reset form fields
    setName("");
    setAge("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        fullWidth
        variant="outlined"
        style={{ marginBottom: 20 }}
      />
      <TextField
        label="Age"
        type="number"
        value={age}
        onChange={(e) => setAge(Number(e.target.value))}
        required
        fullWidth
        variant="outlined"
        style={{ marginBottom: 20 }}
        inputProps={{ min: 0 }} // Prevents negative input
      />
      <FormControl fullWidth style={{ marginBottom: 20 }}>
        <Select
          value={gender}
          onChange={(e) => setGender(e.target.value as string)}
        >
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
        </Select>
      </FormControl>
      <RadioGroup row value={role} onChange={(e) => setRole(e.target.value)}>
        <FormControlLabel value="admin" control={<Radio />} label="Admin" />
        <FormControlLabel value="user" control={<Radio />} label="User" />
      </RadioGroup>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        style={{ marginBottom: 20 }}
      >
        Submit
      </Button>
    </form>
  );
};

export default FormComponent;
