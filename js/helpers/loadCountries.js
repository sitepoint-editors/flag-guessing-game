export default async function loadCountries(file) {
  try {
    const response = await fetch(file);
    return await response.json();
  } catch (error) {
    throw new Error(error);
  }
}

