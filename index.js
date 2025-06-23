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

        if(action === 'Create Account'){
            createAccount();
        }
    })
    .catch((err) => console.log(err));
}


// create an account
function createAccount(){
console.log(chalk.bgGreen.black('Congratulations! Your account has been created!'));
console.log(chalk.white('Chose yout account options below:'));
}