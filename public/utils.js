export const formatDate=(isoDateString) =>{
  // Create a new Date object from the ISO 8601 string
  const date = new Date(isoDateString);

  // Extract day, month, and year components
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();

  // Concatenate the components to form the "dd/mm/yyyy" format
  const formattedDate = `${day}/${month}/${year}`;

  return formattedDate;
}
export const formatDate1=(isoDateString) =>{
  // Create a new Date object from the ISO 8601 string
  const date = new Date(isoDateString);

  // Extract day, month, and year components
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();

  // Concatenate the components to form the "dd/mm/yyyy" format
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}

