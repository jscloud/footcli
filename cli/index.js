#!/usr/bin/env node

var program   = require('commander');
var http      = require('http');
var cliTable  = require('cli-table');

program
  .version('0.0.2')
  .usage('[options]')
  .option('-g, --goals [goals]', 'Goals table')
  .option('-n, --next [next]', 'Next match')
  .option('-u, --update [update]', 'Update Remote Database')
  .parse(process.argv);

if (program.goals) 
{
  var options = {
    hostname: 'emitter.pasting.io',
    port: 80,
    path: '/?goals=1',
    method: 'GET'
  };

  var data = '';
  var req = http.request(options, function(res) 
  {
    res.on('data', function(response) 
    {
      data += response; 
    });

    res.on('end', function() {

      var jsonObj = JSON.parse(data);
      var goleatorsLimit = 9;

      var table = new cliTable({
          head: [ "#",'Player', '#Goals', "Team Name"]
      });

      for (var i = 0; i <= goleatorsLimit; i++) {
        table.push(
          [
            i+1, 
            jsonObj['Goleador'][i].cell_text, 
            jsonObj['Goles'][i].cell_text,
            jsonObj['Equipo'][i].cell_text
          ]
        );
      };

      console.log(table.toString());

    });

  });

  req.on('error', function(e) {
    process.stdout.write('Error: OLX Football CLI: ' + e.message);
    console.log('Error: OLX Football CLI: ' + e.message);
  });

  req.end();

} else {

  if (program.update) 
  {
    var options = {
      hostname: 'emitter.pasting.io',
      port: 80,
      path: '/data/do.php',
      method: 'GET'
    };

    console.log('Updating..');

    var req = http.request(options, function(res) 
    {
      res.on('data', function (response) 
      {
        console.log('Updating...');
      });
      res.on('end', function() 
      {
        console.log('Updated !');
      });
    });

    req.on('error', function(e) {
      process.stdout.write('Error: OLX Football CLI: ' + e.message);
      console.log('Error: OLX Football CLI: ' + e.message);
    });

    req.end();

  } else {

    if (program.next) {

      var options = {
        hostname: 'emitter.pasting.io',
        port: 80,
        path: '/?next=1',
        method: 'GET'
      };

      var req = http.request(options, function(res) 
      {
        var data = '';
        res.on('data', function(response) 
        {
          data += response;
        });

        res.on('end', function () 
        {
          var jsonObj = JSON.parse(data);

          var table = new cliTable({
              head: ["#Match", 'Date', 'Team 1', 'Team 2']
          });

          table.push(
            [
              1,
              jsonObj['date'], 
              jsonObj['data']['match1'][0],
              jsonObj['data']['match1'][1]
            ]
          );

          table.push(
            [
              2,
              jsonObj['date'], 
              jsonObj['data']['match2'][0],
              jsonObj['data']['match2'][1]
            ]
          );

          console.log(table.toString());
        });
      });

      req.on('error', function(e) {
        process.stdout.write('Error: OLX Football CLI: ' + e.message);
        console.log('Error: OLX Football CLI: ' + e.message);
      });

      req.end();

    } else {

      var options = {
        hostname: 'emitter.pasting.io',
        port: 80,
        path: '/?table=1',
        method: 'GET'
      };

      var req = http.request(options, function(res) 
      {
        var data = '';
        res.on('data', function(response) 
        {
          data += response;
        });

        res.on('end', function () 
        {
          var jsonObj = JSON.parse(data);
          var teamCount = Object.keys(jsonObj['Equipo']).length;

          var table = new cliTable({
              head: ["#",'Team', 'Points', "PJ", "G", "E", "P", "GF", "GC", "DF"]
          });

          for (var i = 0; i <= (teamCount - 1); i++) {
            table.push(
              [
                i+1,
                jsonObj['Equipo'][i].cell_text, 
                jsonObj['Puntos'][i].cell_text,
                jsonObj['PJ'][i].cell_text,
                jsonObj['G'][i].cell_text,
                jsonObj['E'][i].cell_text,
                jsonObj['P'][i].cell_text,
                jsonObj['GF'][i].cell_text,
                jsonObj['GC'][i].cell_text,
                jsonObj['DF'][i].cell_text
              ]
            );
          };

          console.log(table.toString());
        });
      });

      req.on('error', function(e) {
        process.stdout.write('Error: OLX Football CLI: ' + e.message);
        console.log('Error: OLX Football CLI: ' + e.message);
      });

      req.end();

    }

  }

}
