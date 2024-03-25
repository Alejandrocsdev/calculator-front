const numberPad = document.querySelector('.numberPad')
const input = document.querySelector('.calculationInput')
const result = document.querySelector('.calculationResult')
const BASE_URL = 'http://localhost:3000/'
// 沿用答案
let isInheritable = true
console.log('isInheritable: ', isInheritable)

numberPad.addEventListener('click', async (event) => {
  const target = event.target
  const key = target.innerText
  // 排除empty鍵及間隙
  if (target.classList.contains('button')) {
    // AC (All Clear)
    if (target.classList.contains('all-clear')) {
      // input & result 歸零
      input.innerText = 0
      result.innerText = 0
    }
    // CE (Clear Entry)
    else if (target.classList.contains('clear-entry')) {
      if (isInheritable) {
        result.innerText = `Ans = ${input.innerText}`
      } 
      // input 歸零
      input.innerText = 0
      isInheritable = false
    }
    // 退格鍵
    else if (target.classList.contains('backspace')) {
      // 可沿用答案時 => result = Ans = XXX
      if (isInheritable) {
        result.innerText = `Ans = ${input.innerText}`
      } 
      if (input.innerText.length > 1) {
        // 刪除最後一個值
        input.innerText = input.innerText.slice(0, -1)
      } else {
        // 個位數即歸零
        input.innerText = 0
      }
      isInheritable = false
    }
    // 等於鍵
    else if (target.classList.contains('equal')) {
      if (!isNaN(input.innerText)) {
        // 如input沒有運算子,input直接進入result
        result.innerText = `${input.innerText} =`
        // 可沿用答案
        isInheritable = true
      } else if (isNaN(input.innerText.slice(-1))) {
        window.alert('格式錯誤')
      } else if (input.innerText.includes('/0')) {
        window.alert('除數不可為0')
      } else {
        const encoded = encodeURIComponent(input.innerText)
        axios.get(`${BASE_URL}formula?value=${encoded}`).then((response) => {
          const data = response.data
          const answer = data.answer
          result.innerText = `${input.innerText} =`
          input.innerText = answer
        })
        // 可沿用答案
        isInheritable = true
      }
    }
    // 數字 & 運算子
    else {
      // 處理0
      if (input.innerText === '0') {
        // 可沿用答案時 => result = Ans = XXX
        if (isInheritable) {
          result.innerText = `Ans = ${input.innerText}`
        } 
        if (!isNaN(key)) {
          // 數字取代0
          input.innerText = key
        } else if (isNaN(key)) {
          // 沿用result值繼續計算
          input.innerText += key
        }
        isInheritable = false
      }
      // 處理數字
      else if (!isNaN(input.innerText.slice(-1))) {
        // 可沿用答案時 => result = Ans = XXX
        if (isInheritable) {
          result.innerText = `Ans = ${input.innerText}`
          // 數字
          if (!isNaN(key)) {
            input.innerText = key
          } 
          // 運算子
          else if (isNaN(key)) {
            input.innerText += key
          }
        } 
        // 不可沿用答案時 => input數字可堆疊
        else if (isInheritable === false) {
          input.innerText += key
        }
        isInheritable = false
      }
      // 處理運算子
      else if (isNaN(input.innerText.slice(-1))) {
        if (!isNaN(key)) {
          // 運算子可以堆疊: 數字
          input.innerText += key
        } else if (isNaN(key)) {
          // 運算子不可以堆疊: 運算子
          input.innerText = input.innerText.slice(0, -1) + key
        }
      }
    }
  }
  console.log('isInheritable: ', isInheritable)
})
