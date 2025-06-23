const inquire = require('inquirer');
const chalk = require('chalk');

const fs = require('fs');

operation();

function operation(){
    inquire.prompt([{
        type:'list',
        name:'action',
        message:'What do you want to do?',
        choices:[
            'Create Account',
            'Check Balance',
            'Deposit',
            'Withdraw',
            'Logout'
        ]
    }])
    .then((anwser) => {
        const action = anwser['action'];

        console.log(chalk.bgBlue.black.bold(`You chose: ${action}`))
    })
    .catch((err) => console.log(err));
}