const expenseForm = document.getElementById("expenseForm");
const expenseList = document.getElementById("expenseList");
const premiumStatus = document.getElementById("premiumStatus");
const leaderboardList = document.getElementById("leaderboardList");

function fetchExpenses() {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:3000/expense', {headers: {'authorization': token}})
        .then((res) => {
            const expenses = res.data;
            expenseList.innerHTML = '';

            expenses.forEach((expense) => {
                appendExpenseToList(expense);
            });
        })
        .catch(err => {
            console.error('Error fetching expenses:', err);
        });
}

function appendExpenseToList(expense) {
    const listItem = document.createElement('li');
    listItem.textContent = `${expense.amount} - ${expense.description} - ${expense.category}  `;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Expense';
    deleteButton.onclick = () => {
        deleteExpense(expense.id);
    };

    listItem.appendChild(deleteButton);
    expenseList.appendChild(listItem);
}

expenseForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const token = localStorage.getItem('token');
    const formData = new FormData(expenseForm);
    const amount = formData.get('expenseAmount');
    const description = formData.get('description');
    const category = formData.get('category');

    axios.post('http://localhost:3000/expense', { amount, description, category }, {headers: {'authorization': token}})
        .then((res) => {
            fetchExpenses();
            // showLeaderboard();
            expenseForm.reset();
        })
        .catch(err => {
            console.error('Error adding expense:', err);
        });
});

function deleteExpense(expenseId) {
    const token = localStorage.getItem('token');
    axios.delete(`http://localhost:3000/expense/${expenseId}`,  {headers: {'authorization': token}})
        .then((res) => {
            fetchExpenses();
        })
        .catch(err => {
            if (err.response && err.response.status === 404) {
                alert('Expense not found or already deleted.'); 
            } else {
                console.error('Error deleting expense:', err);
            }
        });
}

const premiumButton = document.getElementById("rzp-button");
premiumButton.addEventListener("click", function (event) {
  const token = localStorage.getItem("token");
//   console.log(token); 
  axios
    .get("http://localhost:3000/purchase/premiumMembership", {
      headers: { Authorization: token },
    })
    .then((response) => {
      var options = {
        key: response.data.key_id,
        order_id: response.data.order.id,
        handler: function (response) {
          axios
            .post(
              "http://localhost:3000/purchase/updateTransactionStatus",
                {
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id,
                },
                { headers: { Authorization: token } }
            )
            .then((response) => {
                alert("You are a premium user now");
                // premiumStatus.innerHTML = "You are a Premium User";
                // localStorage.setItem("token", response.data.token);
            })
            .catch((err) => {
              console.log(err);
            });
        },
      };
      const razorpayInstance = new Razorpay(options);
      razorpayInstance.open();
      razorpayInstance.on("payment.failed", function () {
        alert("Something went wrong");
        // premiumStatus.innerHTML = "";
      });
    })
    .catch((err) => {
      console.log(err);
    });

  event.preventDefault();
});

function checkPremiumStatus() {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:3000/user/premiumStatus', { headers: { 'authorization': token } })
        .then((res) => {
            if (res.data.status === 'SUCCESS') {
                premiumStatus.innerHTML = "You are a Premium User  ";
                const leaderboardButton = document.createElement('button');
                leaderboardButton.textContent = 'Show Leaderboard';
                leaderboardButton.onclick = () => {
                    leaderboardList.innerHTML = '<h1>Leader Board</h1>'
                    showLeaderboard();
                }
                premiumStatus.appendChild(leaderboardButton);

            } else {
                premiumStatus.innerHTML = "";
            }
        })
        .catch(err => {
            console.error('Error checking premium status:', err);
        });
}

function showLeaderboard(){
    const token = localStorage.getItem('token');
    axios.get('http://localhost:3000/premium/leaderboard',  { headers: { 'authorization': token } })
        .then((res) => {
            const leaderboard = res.data;
            leaderboard.innerHTML = '';

            leaderboard.forEach((user) => {

                const listItem = document.createElement('li');
                listItem.textContent = `NAME - ${user.name} TOTAL EXPENSES - ${user.total} `;
                leaderboardList.appendChild(listItem);
            });
        })
        .catch(err => {
            console.error('Error fetching expenses:', err);
        }); 
}

window.onload = function() {
    fetchExpenses();
    checkPremiumStatus();
};