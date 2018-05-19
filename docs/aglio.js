const aglio = require('aglio');


const blueprint = `
#POST http://localhost:8080/api/documents
Content-Type: application/json
{"name": "Test", "tree": "{}"}

{
  "id": "5b0017c2d4b48b2318192e3f",
  "name": "Test",
  "tree": "{}",
  "changeDate": "1526732738482"
}


# GET /v1/users 
+ Response 200 (text/plain)

Hello World!
`;

const options = {
    themeVariables: 'default'
};

// aglio.render(blueprint, options, function (err, html, warnings) {
//     if (err) return console.log(err);
//     if (warnings) console.log(warnings);
//
//     console.log(html);
// });


aglio.renderFile('user.apib', 'output.html', options, function (err, warnings) {
    if (err) return console.log(err);
    if (warnings) console.log(warnings);
});