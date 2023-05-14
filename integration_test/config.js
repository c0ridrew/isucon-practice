import http from "k6/http";

const BASE_URL = "http://localhost";

export function url (path) {
  return `${BASE_URL}${path}`;
}