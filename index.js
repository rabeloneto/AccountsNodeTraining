const inquirer = require('inquirer');
const chalk = require('chalk');

const fs = require('fs');

operation();

function operation(){
    inquirer.prompt([{
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
        }else if(action === 'Check Balance'){
            getAccountBalance();
        } else if(action === 'Deposit'){
            deposit();
        } else if(action === 'Withdraw'){
            withdraw();
        }else if(action === 'Logout'){
            console.log(chalk.bgBlue.black.bold('Thank you for using our services!'));
            process.exit();
        }
    })
    .catch((err) => console.log(err));
}


// create an account
function createAccount(){
console.log(chalk.bgGreen.black('Congratulations! Your account has been created!'));
console.log(chalk.white('Chose yout account options below:'));
buildAccount();
}

function buildAccount(){
    inquirer.prompt([{
        name:'AccountName',
        message:'What is your account name?'
    }]).then((anwser) => {
        const accountName = anwser['AccountName'];

        console.info(accountName)

        if(!fs.existsSync('accounts')){
            fs.mkdirSync('accounts');
        }

        if(fs.existsSync(`accounts/${accountName}.json`)){
            console.log(chalk.bgRed.black('This account already exists, please choose another name'));
            buildAccount();
            return;
        }

        fs.writeFileSync(`accounts/${accountName}.json`,'{"balance": 0}',
            function(err){
                console.log(err)
            },
        )

        console.log(chalk.bgGreen.white('Congratulations, your account has beens created'))


    }).catch((err) => console.log(err))
}

function deposit(){
    inquirer.prompt([{
        name:'accountName',
        message:'What is your account name?'
    }]).then((anwser) =>{

        const accountName = anwser['accountName'];
        //check account exists

        if(!checkAccount(accountName)){
            return deposit();
        }

        inquirer.prompt([{
            name:'amount',
            message:'How much do you want to deposit?'
        }]).then((anwser) => {
            const amount = anwser['amount'];

            //add amount
            addAmount(accountName,amount);
            operation();

        }).catch((err) => console.log(err))

    }).catch((err) => console.log(err))
}
//check account exists
function checkAccount(accountName){
    if(!fs.existsSync(`accounts/${accountName}.json`)){
        console.log(chalk.bgRed.black('this account does not exist'))
       
        return false;
    }

    return true;
}

//add amount
function addAmount(accountName, amount){
    const accountData = getAccount(accountName);
    if(!amount){
        console.log(chalk.bgRed.black('You need to enter a valid amount'));
        return deposit();
    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance);
    
    fs.writeFileSync(`accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function(err){
            console.log(err);
        }
    )

    console.log(chalk.bgGreen.white(`You deposited ${amount}`));
}
//get account 
function getAccount(accountName){
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`,{
        encoding:'utf8',
        flag:'r'
    })

    return JSON.parse(accountJSON);
}
//show account balance
function getAccountBalance(){
inquirer.prompt([{
    name:'accountName',
    message:'What is yout account name?'
}]).then((anwser)=>{
    const accountName = anwser['accountName'];

    if(!checkAccount(accountName)){
        return getAccountBalance();
    }

    const accountData = getAccount(accountName);
    console.log(chalk.bgBlue.white(`Your balance is: ${accountData.balance}`));
    operation();
}).catch((err) => console.log(err));

}
function withdraw() {
  inquirer
    .prompt([
      {
        name: 'accountName',
        message: 'What is your account name?',
      },
    ])
    .then((answer) => {
      const accountName = answer['accountName']

      if (!checkAccount(accountName)) {
        return withdraw()
      }

      inquirer
        .prompt([
          {
            name: 'amount',
            message: 'How much do you want to withdraw?',
          },
        ])
        .then((answer) => {
          const amount = answer['amount']

          removeAmount(accountName, amount)
          
        }).catch((err) => console.log(err))
    }).catch((err) => console.log(err))
}
function removeAmount(accountName, amount) {
  const accountData = getAccount(accountName)

  if (!amount) {
    console.log(
      chalk.bgRed.black('You need to enter a valid amount'),
    )
    return withdraw()
  }

  if (accountData.balance < amount) {
    console.log(chalk.bgRed.black('You dont have this amount in your account'))
    return withdraw()
  }

  accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)

  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    function (err) {
      console.log(err)
    },
  )

  console.log(
    chalk.green(`You withdraw: ${amount} from your account`),
  )
}