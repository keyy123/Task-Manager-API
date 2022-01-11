const calcTip = (total, tipPercent=.2) => total + (total * tipPercent)
//     const tip = total * tipPercent
//     return (tip + total)
// }

const fahrenheitToCelsius = (temp) => {
    return (temp - 32) / 1.8
}

const celsiusToFahrenheit = (temp) => {
    return (temp * 1.8) + 32
}

const groceryItem = (item = "peanut butter") => {
    return new Promise((resolve, reject)=>{
        resolve(item)
        reject()
    })
}

module.exports = {
    calcTip,
    fahrenheitToCelsius,
    celsiusToFahrenheit,
    groceryItem
}