import { load } from "./storage";

export async function loadContacts() {
  // Load emergency contacts from local storage; return empty array if none
  return load("contacts", []);
}
