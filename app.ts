import express from 'express';
import createError from 'http-errors';

import { expressRouter as shorturlGetApiRouter } from './src/api/shorturl/get';
import { expressRouter as shorturlAnalyticsGetApiRouter } from './src/api/shorturl/analytics/get';
import { expressRouter as shorturlPostApiRouter } from './src/api/shorturl/post';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/shorturl/analytics', shorturlAnalyticsGetApiRouter);
app.use('/api/shorturl', shorturlGetApiRouter);
app.use('/api/shorturl', shorturlPostApiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: true, message: err.message, httpCode: err.status });
});

export default app;
