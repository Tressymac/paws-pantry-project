require('dotenv').config();
require('app-module-path').addPath(__dirname);

const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const app = express();
const swaggerUI = require('swagger-ui-express');
const swaggerFile = require('services/swagger_output.json');
const swaggerUiOptions = {
  customSiteTitle: 'New schedule API Docs',
  customCss: '.swagger-ui .topbar{display: none}'
};

// Routes
const indexRouter = require('./routes/api/v1/index');

// Cors 
const corsOptions ={
  origin:'*', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());
// app.use(cors());
// app.use(cors(corsOptions));
app.use(cors({credentials: true, origin: 'http://localhost:8000'}));


app.use('/', indexRouter);
app.use('/api/v1/docs', swaggerUI.serve, swaggerUI.setup(swaggerFile, swaggerUiOptions));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
