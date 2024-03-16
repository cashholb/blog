import createError from 'http-errors'
import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import router from './routes/blogRouter';

import 'dotenv/config'
import cors from "cors";

const app = express();
app.use(cors<Request>());

const PORT = process.env.PORT || 3000;

// Set up mongoose connection
mongoose.set("strictQuery", false);

const mongoDB: string | undefined = process.env.DB_CON;
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB ? mongoDB : '3000');
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/blog", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// catch 404 and forward to error handler
app.use(function(req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function(err: { message: any; status: any; }, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});