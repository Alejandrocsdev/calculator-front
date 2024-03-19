const numberPad = document.querySelector('.numberPad')
const numberBtn = document.querySelector('.number')
const operatorBtn = document.querySelector('.operator')
const backspaceBtn = document.querySelector('.backspace')
const deleteBtn = document.querySelector('.delete')
const getResultBtn = document.querySelector('.getResult')
const calculationInput = document.querySelector('.calculationInput')
const calculationResult = document.querySelector('.calculationResult')

//運算式包含三個值[ 數字1, 加減乘除, 數字2]
let inputList = []

//監聽整個鍵盤，紀錄按下按鈕的值，當湊滿運算式三個值，便執行算數
numberPad.addEventListener('click', function numberPadClicked(event) {
  //按下按鈕的值
  let itemClicked = event.target.textContent.trim()
  console.log(itemClicked)

  //紀錄運算式第一個值(數字1)
  if (inputList.length === 0) {
    console.log('if判定: length is 0')
    if (!isNaN(itemClicked)) {
      console.log('是數字:', itemClicked)
      inputList[0] = itemClicked
      console.log('更新之inputList:', inputList)
      calculationInput.textContent = inputList[0]
    }
  }
  //紀錄運算式第一個值(數字1)及第二個值(加減乘除)
  else if (inputList.length === 1) {
    console.log('if判定: length is 1')
    if (!isNaN(itemClicked)) {
      console.log('是數字:', itemClicked)
      inputList[0] = inputList[0] + itemClicked
      console.log('更新之inputList:', inputList)
      calculationInput.textContent = inputList[0]
    } else if (
      itemClicked === '+' ||
      itemClicked === '-' ||
      itemClicked === '*' ||
      itemClicked === '/'
    ) {
      console.log('是運算子:', itemClicked)
      inputList[1] = itemClicked
      console.log('更新之inputList:', inputList)
      calculationInput.textContent = `${inputList[0]} ${inputList[1]}`
    }
  }
  //紀錄運算式第二個值(加減乘除)及第三個值(數字2)
  else if (inputList.length === 2) {
    console.log('if判定: length is 2')
    if (!isNaN(itemClicked)) {
      console.log('是數字:', itemClicked)
      inputList[2] = itemClicked
      console.log('更新之inputList:', inputList)
      calculationInput.textContent = `${inputList[0]} ${inputList[1]} ${inputList[2]}`
      calculation()
      calculationResult.textContent = calculation()
    } else if (
      itemClicked === '+' ||
      itemClicked === '-' ||
      itemClicked === '*' ||
      itemClicked === '/'
    ) {
      console.log('是運算子:', itemClicked)
      inputList[1] = itemClicked
      console.log('更新之inputList:', inputList)
      calculationInput.textContent = `${inputList[0]} ${inputList[1]}`
    }
  }
  //紀錄運算式第三個值(數字2)、更新第二個值(加減乘除)、直接算出結果
  else if (inputList.length === 3) {
    console.log('if判定: length is 3')
    if (!isNaN(itemClicked)) {
      console.log('是數字:', itemClicked)
      inputList[2] = inputList[2] + itemClicked
      console.log('更新之inputList:', inputList)
      calculationInput.textContent = `${inputList[0]} ${inputList[1]} ${inputList[2]}`
      calculation()
      calculationResult.textContent = calculation()
    } else if (
      itemClicked === '+' ||
      itemClicked === '-' ||
      itemClicked === '*' ||
      itemClicked === '/'
    ) {
      console.log('是運算子:', itemClicked)
      inputList[0] = calculation()
      inputList[1] = itemClicked
      inputList.pop()
      console.log('更新之inputList:', inputList)
      calculationInput.textContent = `${inputList[0]} ${inputList[1]}`
      calculationResult.textContent = ''
    } else if (itemClicked === '=') {
      console.log('是送出結果:', itemClicked)
      inputList[0] = calculation()
      inputList.pop()
      inputList.pop()
      console.log('更新之inputList:', inputList)
      calculationInput.textContent = `${inputList[0]}`
      calculationResult.textContent = ''
    }
  }
})

// 計算前轉換運算子為字串
function operatorTransfer() {
  switch (inputList[1]) {
    case '+':
      return 'plus'
      break
    case '-':
      return 'minus'
      break
    case '*':
      return 'multiply'
      break
    case '/':
      return 'divide'
      break
    default:
      return 'error!'
  }
}

//計算及API請求
function calculation() {
  console.log('do calculation')
  let num1 = Number(inputList[0])
  let operator = operatorTransfer()
  let num2 = Number(inputList[2])
  console.log(`http://localhost:5000/${operator}?num1=${num1}&num2=${num2}`)

  axios
    .get(`http://localhost:5000/${operator}?num1=${num1}&num2=${num2}`)
    .then(function (response) {
      console.log(response)
      console.log(response.data)
    })
    .catch(function (error) {
      console.log(error)
    })
}

//   function calculation() {
//     console.log('do calculation')
//     if (inputList[1] === '+') {
//       result = Number(inputList[0]) + Number(inputList[2])
//     }
//     if (inputList[1] === '-') {
//       result = Number(inputList[0]) - Number(inputList[2])
//     }
//     if (inputList[1] === '*') {
//       result = Number(inputList[0]) * Number(inputList[2])
//     }
//     if (inputList[1] === '/') {
//       result = Number(inputList[0]) / Number(inputList[2])
//     }
//     console.log(result)
//     return result
//   }
// })
