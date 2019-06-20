// Author: Thanh Dương
// Ngan sach - Phi Ton - Tien con lai
class UI {
  constructor() {
    this.budgetFeedback = document.querySelector(".budget-feedback")
    this.budgetForm = document.getElementById("budget-form")
    this.budgetInput = document.getElementById("budget-input")
    this.budgetAmount = document.getElementById("budget-amount")

    this.expenseFeedback = document.querySelector(".expense-feedback")
    this.expenseAmount = document.getElementById("expense-amount")
    this.expenseForm = document.getElementById("expense-form")
    this.expenseInput = document.getElementById("expense-input")
    this.expenseList = document.getElementById("expense-list")

    this.balance = document.getElementById("balance")
    this.balanceAmount = document.getElementById("balance-amount")
    
    this.amountInput = document.getElementById("amount-input")
    this.itemList = []
    this.itemID = 0
  }

  // SUBMIT BUDGET
  submitBudgetForm() {
    const budgetValue = this.budgetInput.value
    if (budgetValue === '' || budgetValue < 0) {
      this.budgetFeedback.classList.add('showItem')
      this.budgetFeedback.innerHTML = `Empty Budget Value!`
      const self = this
      setTimeout(function() {
        self.budgetFeedback.classList.remove('showItem')
      }, 3000)
    }
    else {
      this.budgetAmount.textContent = budgetValue
      this.budgetInput.value = ''
      this.showBalance()
    }
  }
  // show balance
  showBalance() { 
    const expense = this.totalExpense()
    const total = parseInt(this.budgetAmount.textContent) - expense
    this.balanceAmount.textContent = total
    if (total < 0) {
      this.balance.classList.remove('showGreen', 'showBlack')
      this.balance.classList.add('showRed')
    } 
    else if (total > 0) {
      this.balance.classList.remove('showRed', 'showBlack')
      this.balance.classList.add('showGreen')
    } 
    else if (total === 0) {
      this.balance.classList.remove('showGreen', 'showRed')
      this.balance.classList.add('showBlack')
    }
  }
  // total expense
  totalExpense() {
    let total = 0
    if (this.itemList.length > 0) {
      total = this.itemList.reduce(function(acc, curr) {    // current
        acc += curr.amount
        return acc
      }, 0)
    }
    this.expenseAmount.textContent = total
    return total
  }


  // SUBMIT EXPENSE
  submitExpenseForm() {
    const expenseValue = this.expenseInput.value
    const amountValue = this.amountInput.value
    if (expenseValue === '' || amountValue === '' || amountValue < 0) {
      this.expenseFeedback.classList.add('showItem')
      this.expenseFeedback.innerHTML = `Empty Value!`
      const self = this
      setTimeout(function() {
        self.expenseFeedback.classList.remove('showItem')
      }, 3000)
    }
    else {
      let amount = parseInt(amountValue)
      this.expenseInput.value = ''
      this.amountInput.value = ''
      
      let expense = {
        id: this.itemID,
        title: expenseValue,
        amount: amount
      }
      this.itemID ++
      this.itemList.push(expense)
      this.addExpense(expense)
      this.showBalance()
    }
  }
  // add expense
  addExpense(expense) {
    const div = document.createElement('div')
    div.classList.add('expense')
    div.innerHTML = `
      <div class="expense-item d-flex justify-content-between align-items-baseline">
        <h5 class="expense-title mb-0 text-uppercase list-item font-weight-bold">${ expense.title }</h5>
        <h5 class="expense-amount mb-0 list-item font-weight-bold">${ expense.amount }</h5>
        <div class="expense-icons list-item">
          <a href="#" class="edit-icon mx-2" data-id="${ expense.id }">
            <i class="fas fa-edit"></i>
          </a>
          <a href="#" class="delete-icon" data-id="${ expense.id }">
            <i class="fas fa-trash"></i>
          </a>
        </div>
      </div>
    `
    this.expenseList.appendChild(div)
  }

  // edit expense
  editExpense(element) {
    let id =parseInt(element.dataset.id)
    let parent = element.parentElement.parentElement.parentElement
    // remove from the dom
    this.expenseList.removeChild(parent)
    // remove from the list
    let expense = this.itemList.filter(function(item) {
      return item.id === id
    })
    // show value
    this.expenseInput.value = expense[0].title
    this.amountInput.value = expense[0].amount
    // remove from the list
    let tmpList = this.itemList.filter(function(item) {
      return item.id !== id
    })
    this.itemList = tmpList
    this.showBalance()
  }

  // delete expense
  deleteExpense(element) {
    let id =parseInt(element.dataset.id)
    let parent = element.parentElement.parentElement.parentElement
    this.expenseList.removeChild(parent)
    let tmpList = this.itemList.filter(function(item) {
      return item.id !== id
    })
    this.itemList = tmpList
    this.showBalance()
  }
}

function eventListeners() {
  const budgetForm = document.getElementById("budget-form")
  const expenseForm = document.getElementById("expense-form")
  const expenseList = document.getElementById("expense-list")

  // new instance of UI class
  const ui = new UI()

  // budget form submit
  budgetForm.addEventListener('submit', function(event) {
    event.preventDefault()
    ui.submitBudgetForm()
  })

  // expense form submit
  expenseForm.addEventListener('submit', function(event) {
    event.preventDefault()
    ui.submitExpenseForm()
  })

  // expense click
  expenseList.addEventListener('click', function(event) {
    if (event.target.parentElement.classList.contains('edit-icon')) {
      ui.editExpense(event.target.parentElement)
    }
    if (event.target.parentElement.classList.contains('delete-icon')) {
      ui.deleteExpense(event.target.parentElement)
    }
  })
}

document.addEventListener('DOMContentLoaded', function() {
  eventListeners()
})

