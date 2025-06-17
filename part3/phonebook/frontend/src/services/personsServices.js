import axios from "axios";

const baseUrl = "/api/persons";

/* 
- get persons from backend
- create people 
- delete people button
- add number replacement functionality 
*/

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = (newObject) => {
  const request = axios.post(baseUrl, newObject);
  return request.then((response) => response.data);
};

const remove = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
};

const update = (id, changedObject) => {
  const request = axios.put(`${baseUrl}/${id}`, changedObject);
  return request.then((response) => response.data);
};

export default { getAll, create, remove, update };
