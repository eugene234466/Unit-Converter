const input = document.getElementById('input')
const fromUnit = document.getElementById('FromUnit')
const ToUnit = document.getElementById('ToUnit')
const convertBtn = document.querySelector('.convert-btn')
const result = document.getElementById('result')

const baseUnits = {
    'kilograms(kg)': 1,
    'grams(g)': 1000,
    'milligrams(mg)': 1000000,
    'pounds(lb)': 2.204622622185,
    'ounces(oz)': 35.27396194958,
    'stones(st)': 0.15747304441777
};


function convert(){
    const inputValue = input.value.trim()
    if(inputValue === '' || isNaN(parseFloat(inputValue))){
        result.textContent = 'Please enter a valid number'
        return
    }

    const value = parseFloat(inputValue)
    const from = fromUnit.value
    const to = ToUnit.value

    

    const kilograms = value / baseUnits[from]
    const convertedValue = kilograms * baseUnits[to]

    result.textContent = `${convertedValue.toFixed(4)} ${to}`
}    


convertBtn.addEventListener('click', convert);
input.addEventListener('input', convert);
fromUnit.addEventListener('change', convert);
ToUnit.addEventListener('change', convert);