const User = require('../modles/user');
const Expense = require('../modles/expense');
const sequelize = require('../util/database');

exports.getUserLeaderboard = async (req, res, next) => {
    try{
        const userLeaderboardDetails = await User.findAll({
            attributes: ["name", "total"],
            order: [["total", "DESC"]]
        });

        // much more optimesed way is writtened above
        // const userAggregatedExpense = await Expense.findAll({
        //     attribute: ['userId', [sequelize.fn('sum', sequelize.col('expense.amount')), 'total_expense']],
        //     group: ['userId'] 
        // });

        // // Above is the optimised way of the commented code.
        // // const userAggregatedExpense = {};
        // // console.log(expenses);
        // // expenses.forEach((expense => {
        // //     if(userAggregatedExpense[expense.userId]){
        // //         userAggregatedExpense[expense.userId] = userAggregatedExpense[expense.userId] + expense.amount;
        // //     }else{
        // //         userAggregatedExpense[expense.userId] = expense.amount;
        // //     }
        // // })) 

        // let userLeaderboardDetails = [];
        // users.forEach((user) =>{
        //     userLeaderboardDetails.push({name: user.name, total_expense: userAggregatedExpense[user.id] });      
        // })
        // console.log(userLeaderboardDetails);
        // userLeaderboardDetails.sort((a, b) => b.total_expense - a.total_expense);
        res.status(200).json(userLeaderboardDetails);
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
}