import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware function to check working hours
function checkWorkingHours(req, res, next) {
  const currentDateTime = new Date();
  const day = currentDateTime.getDay();
  const hour = currentDateTime.getHours();

  // Check if it's Monday to Friday
  if (day >= 1 && day <= 5) {
    // Check if it's between 9 AM and 5 PM
    if (hour >= 9 && hour < 17) {
      return next(); // Continue to the next middleware or route handler
    }
  }

  // If not within working hours, send a 403 Forbidden response
  res
    .status(403)
    .send(
      "<h1>The web application is only available during working hours <br> (Monday to Friday, from 9 AM to 5 PM)</h1>."
    );
}

// Apply the middleware to all routes
app.use(checkWorkingHours);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/", (req, res) => {
  const homepage = fs.readFileSync("./public/homepage.html");
  res.status(200);
  res.send(`${homepage}`);
});

app.get("/services", (req, res) => {
  const services = fs.readFileSync("./public/ourServices.html");
  res.status(200);
  res.send(`${services}`);
});

app.get("/contact", (req, res) => {
  const contact = fs.readFileSync("./public/contactUs.html");
  res.status(200);
  res.send(`${contact}`);
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
