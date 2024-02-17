import express, { Request, Response } from 'express';
import router from './routes/blogRouter';

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/blog", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
