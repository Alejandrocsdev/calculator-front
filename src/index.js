const numberPad = document.querySelector('.numberPad')
const input = document.querySelector('.calculationInput')
const result = document.querySelector('.calculationResult')
const BASE_URL = 'http://localhost:3000/'

numberPad.addEventListener('click', async (event) => {
  const target = event.target
  const key = target.innerText
  // 排除empty鍵及間隙
  if (target.classList.contains('button')) {
    // AC (All Clear)
    if (target.classList.contains('delete')) {
      // input歸零
      input.innerText = '0'
    } 
    // 退格鍵
    else if (target.classList.contains('backspace')) {
      if (input.innerText.length > 1) {
        // 刪除最後一個值
        input.innerText = input.innerText.slice(0, -1)
      } else {
        // 個位數即歸零
        input.innerText = '0'
      }
    } 
    // 等於鍵
    else if (target.classList.contains('equal')) {
      if (!isNaN(input.innerText)) {
        // 如input沒有運算子,input直接進入result
        result.innerText = input.innerText
      } else {
        // 如input有運算子:
        let operator = ''
        // (1)找到運算子並宣告至operator變數
        for (let i = 0; i < input.innerText.length; i++) {
          if (isNaN(input.innerText[i])) {
            operator = input.innerText[i]
            break
          }
        }
        // 使用split將operator左右數值變成陣列
        const inputList = input.innerText.split(operator)
        // operator轉換成request path推至inputList[供calculation()計算用]
        inputList.push(operatorTransfer(operator))
        // result顯示答案
        result.innerText = await calculation(inputList)
      }
      // input歸零
      input.innerText = 0
    } 
    // 數字 & 運算子
    else {
      if (input.innerText === '0') {
        if (!isNaN(key)) {
          // 數字取代0
          input.innerText = key
        } else if (isNaN(key)) {
          // 沿用result值繼續計算
          input.innerText = result.innerText + key
        }
      } else if (!isNaN(input.innerText.slice(-1))) {
        // 數字可以疊加: 數字 & 運算子
        input.innerText += key
      } else if (isNaN(input.innerText.slice(-1))) {
        if (!isNaN(key)) {
          // 運算子可以疊加: 數字
          input.innerText += key
        } else if (isNaN(key)) {
          // 運算子不可以疊加: 運算子
          input.innerText = input.innerText.slice(0, -1) + key
        }
      }
    }
  }
})

// operator => request path
function operatorTransfer(operator) {
  switch (operator) {
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

async function calculation(inputList) {
  try {
    console.log('do calculation')
    let v1 = Number(inputList[0])
    let operator = inputList[2]
    let v2 = Number(inputList[1])
    console.log(`${BASE_URL}${operator}?v1=${v1}&v2=${v2}`)

    const response = await axios.get(`${BASE_URL}${operator}?v1=${v1}&v2=${v2}`)
    console.log(response.data.answer)
    return response.data.answer
  } catch (error) {
    console.log(error)
    throw error
  }
}
