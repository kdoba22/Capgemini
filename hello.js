// Mock transactions for testing
const transactions = [
  { customer: "A", amount: 120, date: "2025-01-15" },
  { customer: "A", amount: 75, date: "2025-02-05" },
  { customer: "A", amount: 200, date: "2025-03-25" },
  { customer: "B", amount: 50, date: "2025-01-20" },
  { customer: "B", amount: 120, date: "2025-03-10" },
  { customer: "C", amount: 90, date: "2025-03-15" },
];

// Async API simulation
function fetchTransactions() {
  // function to retrieve a Promise which is asynch
  return new Promise((resolve) => {
    setTimeout(() => resolve(transactions), 500); // 0.5s delay this delay is to simulate the PRomsie call since it will take time to fulfill
  });
}

// Calculate Rewards
function addPoints(amount) {
  let points = 0;
  if (amount > 100) {
    points += (amount - 100) * 2 + 50; // 2 points for each $ greater than 100 plus 50 for $ between 50 and 100
  } else if (amount > 50) {
    points += amount - 50; // if amount is greater than fifty we know it s between 50 and 100, so take the toal and sub 50 and add that to total
  }

  return points;
}

// Process transactions
async function getCustomerRewards() {
  const data = await fetchTransactions();
  // console.log("Doba - data", data);

  const rewards = {};

  data.forEach(({ customer, amount, date }) => {
    const month = new Date(date).toLocaleString("default", { month: "short" }); // converts to a date format and grabs the month only
    const points = addPoints(amount);

    // this if statment detects a change in customer and created a new JSON object for that custoomer
    if (!rewards[customer]) {
      rewards[customer] = { months: {}, total: 0 }; // creates the object with no values
    }

    if (!rewards[customer].months[month]) {
      rewards[customer].months[month] = 0;
    }

    rewards[customer].months[month] += points;
    rewards[customer].total += points;
    console.log(rewards);
  });
  //  console.log("Doba final retunr = ", rewards);
  return rewards;
}

// Run
getCustomerRewards().then((result) =>
  console.log(JSON.stringify(result, null, 2))
);
// let result = addPoints(120);
// console.log("The total number of points earned is: ", result);
