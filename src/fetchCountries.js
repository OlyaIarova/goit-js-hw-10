
// функція HTTP-запиту

export const fetchCountries = name => {
const baseURL = `https://restcountries.com/v3.1/name/${name}`;
const params = `?fields=name,capital,population,flags,languages`;
const url = `${baseURL}${params}`;
 
  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(`404 not found: ${response.statusText}`);
    }

    return response.json();
  });
};