require('dotenv').config()
const https = require("https");
const fs = require("fs");

const express = require('express')
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { exec } = require('child_process');
const process = require("process");

const app = express()
const port = process.env.PORT
const webhook_secret = process.env.WEBHOOK_SECRET

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const apiRoutes = express.Router();

app.use('/hook', apiRoutes);

https.createServer(
    {
      key: fs.readFileSync("00000002.key"),
      cert: fs.readFileSync("00000002.crt"),
    },
    app
  )
  .listen(port, () => {
    console.log(`server is running at port ${port}`);
  });


/**
 * 
 * @param  {...any} command 
 * 
 * @returns 
 * 
 * Funktion som kör shellkommando som promise
 */
function cmd(...command) {
    let p = exec(command[0], command.slice(1));
    return new Promise((resolve) => {
        p.stdout.on("data", (x) => {
            process.stdout.write(x.toString());
        });
        p.stderr.on("data", (x) => {
            process.stderr.write(x.toString());
        });
        p.on("exit", (code) => {
            resolve(code);
        });
    });
}

/**
 * 
 *
 * @param {*} body 
 * @param {*} secret 
 * @param {*} signature 
 * @returns 
 * 
 * Funktion som validerar webhook secret
 */
function validateSignature(body, secret, signature) {
    console.log("Validating request...")
    var hash = crypto.createHmac(process.env.GITHUB_WEBHOOK_HASHALG, secret)
        .update(JSON.stringify(body))
        .digest('hex');
    console.log(hash)
    console.log(signature)
    return (hash === signature.split("=")[1]);
}

/**
 * Funktion som svarar på vanlig "get"
 */
apiRoutes.get('/', function (req, res, next) {
    res.send("KTH Biblioteket Webhook för EZProxy")
});

/**
 * Funktion som tar emot anrop från Github Actions
 * 
 */
apiRoutes.post('/', function (req, res, next) {
    if (!validateSignature(req.body, webhook_secret, req.get(process.env.GITHUB_WEBHOOK_SIGNATURE_HEADER))) {
        return res.status(401).send({ errorMessage: 'Invalid Signature' });
    }
    console.log("Signature is valid")
    console.log("Received payload")
    console.log(req.body)

    var action = req.body.data.action.toLowerCase();
    switch (action) {
        case process.env.ACTIONEVENT:
            console.log("Starting...")
            exec(`${process.env.GITHUB_DEPLOY_SCRIPT} ${process.env.LOGFILE} ${process.env.REPOPATH} ${process.env.EZPROXYPATH} ${process.env.CONFIGFILE} ${process.env.SHIBFILE}`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    res.status(401).send({ errorMessage: error });
                }
                console.log(stdout);
            });
            break;
        default:
            console.log('No handler for type', action);
    }
    res.status(204).send();
});