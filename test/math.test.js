const {calcTip, fahrenheitToCelsius, celsiusToFahrenheit, groceryItem} = require("../math")

describe('Checking tip calculation funcions', ()=>{
test('should calculate tips to pay for bills', ()=>{
    const total = calcTip(10, .3)
    expect(total).toBe(13)
})

test('should calculate tips for default tip amount', ()=>{
    const total = calcTip(10)
    expect(total).toBe(12)
})
})
describe('Checking temperature conversion functions', ()=>{
    test('Should convert 32 F to 0 C', ()=>{
        const temp = fahrenheitToCelsius(32)
        expect(temp).toBe(0)
    })

    test('Should convert 0 C to 32 F', ()=>{
        const temp = celsiusToFahrenheit(0)
        expect(temp).toBe(32)
    })
})

describe("Checking Grocery Item function", ()=>{
    test('Should default grocery item be peanut butter - Promise version', ()=>{
        return groceryItem().then(data =>{
            expect(data).toBe('peanut butter')
        })
    })

    test('Should default grocery item be peanut butter - async/await version', async ()=>{
        const res = await groceryItem()
        expect(res).toBe('peanut butter')
        

    })
})
// test('should calculate tips to pay for bill with the tip', ()=>{
//     const bill = calcTip(10,.3)
//     expect(bill).toBe(15)
// })
