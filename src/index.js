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
        // input歸零
        input.innerText = 0
      } else if (isNaN(input.innerText.slice(-1))) {
        window.alert('運算子必須搭配數字')
      } else if (input.innerText.includes('/0')) {
        window.alert('除數不可為0')
      } else {
        const encoded = encodeURIComponent(input.innerText)
        axios.get(`${BASE_URL}formula?value=${encoded}`).then((response) => {
          const data = response.data
          const answer = data.answer
          result.innerText = answer
        })
      }
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
