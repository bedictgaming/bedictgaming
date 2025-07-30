const express = require("express");
const fs = require("fs");
const app = express();
const port = 5000;

let contact = require("./contact.json");

app.use(express.json());

// READ - Get all contacts
app.get("/api/contact", (req, res) => {
  res.json(contact);
});

// CREATE - Add a contact
app.post("/api/add-contact", (req, res) => {
  const newContact = {
    id: contact.length + 1,
    name: req.body.name,
    phone: req.body.phone,
  };
  contact.push(newContact);
  saveContacts();
  res.json(newContact);
});

// UPDATE - Edit a contact by ID
app.put("/api/update-contact/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const contactToUpdate = contact.find(c => c.id === id);

  if (!contactToUpdate) {
    return res.status(404).json({ message: "Contact not found" });
  }

  contactToUpdate.name = req.body.name || contactToUpdate.name;
  contactToUpdate.phone = req.body.phone || contactToUpdate.phone;
  saveContacts();
  res.json(contactToUpdate);
});

// DELETE - Remove a contact by ID
app.delete("/api/delete-contact/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = contact.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Contact not found" });
  }

  const deletedContact = contact.splice(index, 1);
  saveContacts();
  res.json(deletedContact[0]);
});

// Save updated contacts to contact.json
function saveContacts() {
  fs.writeFileSync("./contact.json", JSON.stringify(contact, null, 2));
}

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
