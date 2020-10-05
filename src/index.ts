import dotenv from 'dotenv';
dotenv.config();
dotenv.config({
  path: `.env.${process.env.NODE_ENV}`
});
console.log('NODE_ENV =>', process.env.NODE_ENV);
import app from "./server";
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`)
})
