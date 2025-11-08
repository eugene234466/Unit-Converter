const input = document.getElementById('input')
const fromUnit = document.getElementById('FromUnit')
const ToUnit = document.getElementById('ToUnit')
const convertBtn = document.querySelector('.convert-btn')
const result = document.getElementById('result')

const baseUnits = {
    'meters(m)': 1,
    'kilometers(km)': 0.001,
    'centimeters(cm)': 100,
    'millimeters(mm)': 1000,
    'inches(in)': 39.3701,
    'feet(ft)': 3.28084,
    'yards(yd)': 1.09361,
    'miles(mi)': 0.000621371,
    'nautical miles(NM)': 0.000539957
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

    

    const meters = value / baseUnits[from]
    const convertedValue = meters * baseUnits[to]

    result.textContent = `${convertedValue.toFixed(4)} ${to}`
}    


convertBtn.addEventListener('click', convert);
input.addEventListener('input', convert);
fromUnit.addEventListener('change', convert);
ToUnit.addEventListener('change', convert);