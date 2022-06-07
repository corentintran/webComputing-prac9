var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'The World Database API' });
});

router.get('/api', function(req, res, next) {
  res.render('index', { title: 'Lots of routes available' });
});

router.get('/api/city', function(req, res, next) {
  req.db.from('City').select('name','district')
  .then(
    rows => {
      res.status(200).json({
        Error: false,
        Message: "success",
        City: rows
      })
    }
  )
  .catch(err => {
    console.log(err);
    res.status(500).json({
      Error: true,
      Message: "Error in MySQL query"
    })
  });
});


router.get('/api/city/:CountryCode', function(req, res, next) {
  const countryCode = req.params.CountryCode;

  req.db.from('City').select('*').where('CountryCode','=',countryCode)
  //req.db.raw(`SELECT * FROM City WHERE CountryCode = '${countryCode}'`)
  .then(
    rows => {
      res.status(200).json({
        Error: false,
        Message: "success",
        Cities: rows
      })
    }
  )
  .catch(err => {
    console.log(err);
    res.status(500).json({
      Error: true,
      Message: "Error in MySQL query"
    })
  });
});

router.post('/api/update', function(req, res, next) {
  if (!req.body.City || !req.body.CountryCode || !req.body.Pop) {
    res.status(400).json({ Error: true, Message: "Missing parameter" });
    return;
  }
  req.db.from('City').update({'Population': req.body.Pop}).where({'CountryCode': req.body.CountryCode, 'Name': req.body.City })
  .then(() => res.status(200).json({
    Error: false,
    Message: `Updated population of ${req.body.City} to ${req.body.Pop}`
  }))
  .catch(err => {
    console.log(err);
    res.status(500).json({
      Error: true,
      Message: "Error in MySQL query"
    })
  });

  //res.send(JSON.stringify(req.body));

});

module.exports = router;
