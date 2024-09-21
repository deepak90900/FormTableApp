import React, { useState } from "react";
import FormComponent from "./FormComponent";
import TableComponent from "./TableComponent";

interface Data {
  name: string;
  age: number;
  gender: string;
  role: string;
}

const App: React.FC = () => {
  const [data, setData] = useState<Data[]>([
    { name: "John", age: 25, gender: "male", role: "admin" },
    { name: "Jane", age: 30, gender: "female", role: "user" },
  ]);

  // Add new data from the form
  const handleAddData = (formData: Data) => {
    setData([...data, formData]);
  };

  // Update a row
  const handleUpdateRow = (index: number, updatedData: Data) => {
    const updatedDataArray = [...data];
    updatedDataArray[index] = updatedData;
    setData(updatedDataArray);
  };

  // Delete a row
  const handleDeleteRow = (index: number) => {
    const filteredData = data.filter((_, i) => i !== index);
    setData(filteredData);
  };

  // Copy a row
  const handleCopyRow = (index: number) => {
    const copiedRow = { ...data[index] };
    setData([...data, copiedRow]);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Form and Table App</h1>
      <FormComponent onSubmitForm={handleAddData} />
      <TableComponent
        data={data}
        onUpdate={handleUpdateRow}
        onDelete={handleDeleteRow}
        onCopy={handleCopyRow}
      />
    </div>
  );
};

export default App;
