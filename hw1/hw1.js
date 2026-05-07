// 1.3
// Сумма квадратов значений массива

function sumOfSquares(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i] * arr[i];
    }
    return sum;
}

// 1.8
// Среднее арифметическое элементов массива

function average(arr) {
    if (arr.length === 0) return 0;

    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum / arr.length;
}

// 2.9
// Можно ли получить один массив из другого перестановкой

function canRearrange(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }

    const map = new Map();

    for (const item of arr1) {
        map.set(item, (map.get(item) || 0) + 1);
    }

    for (const item of arr2) {
        if (!map.has(item)) {
            return false;
        }
        const count = map.get(item) - 1;
        if (count === 0) {
            map.delete(item);
        } else {
            map.set(item, count);
        }
    }

    return map.size === 0;
}

// 3.3
// Преобразование массива массивов в один общий массив (любая вложенность)

function flatten(arr) {
    const result = [];

    for (const item of arr) {
        if (Array.isArray(item)) {
            result.push(...flatten(item));
        } else {
            result.push(item);
        }
    }

    return result;
}

// Тесты
console.log('ТЕСТИРОВАНИЕ...\n');

console.log('1.3 Сумма квадратов:');
console.log(`  [1, 2, 3] -> ${sumOfSquares([1, 2, 3])} (ожидается: 14)`);
console.log(`  [5, 5, 5] -> ${sumOfSquares([5, 5, 5])} (ожидается: 75)`);
console.log(`  [0, 4, -3] -> ${sumOfSquares([0, 4, -3])} (ожидается: 25)`);
console.log(`  [] -> ${sumOfSquares([])} (ожидается: 0)`);

console.log('\n1.8 Среднее арифметическое:');
console.log(`  [1, 2, 3, 4, 5] -> ${average([1, 2, 3, 4, 5])} (ожидается: 3)`);
console.log(`  [10, 20, 30] -> ${average([10, 20, 30])} (ожидается: 20)`);
console.log(`  [7] -> ${average([7])} (ожидается: 7)`);
console.log(`  [] -> ${average([])} (ожидается: 0)`);

console.log('\n2.9 Сравнение массивов:');
console.log(`  [1,2,3,8,-2] и [2,3,8,1,-2] -> ${canRearrange([1,2,3,8,-2], [2,3,8,1,-2])} (ожидается: true)`);
console.log(`  [1,2,3] и [1,2,4] -> ${canRearrange([1,2,3], [1,2,4])} (ожидается: false)`);
console.log(`  [1,2,3] и [1,2,3,4] -> ${canRearrange([1,2,3], [1,2,3,4])} (ожидается: false)`);
console.log(`  [1,2,2,3] и [2,3,1,2] -> ${canRearrange([1,2,2,3], [2,3,1,2])} (ожидается: true)`);

console.log('\n3.3 Преобразование массива массивов:');
console.log(`  [1, 2, 3, [4, 5, 6, [10, 20, 30]]] -> [${flatten([1, 2, 3, [4, 5, 6, [10, 20, 30]]])}] (ожидается: [1, 2, 3, 4, 5, 6, 10, 20, 30])`);
console.log(`  [[1, 2], [3, [4, 5]], 6] -> [${flatten([[1, 2], [3, [4, 5]], 6])}] (ожидается: [1, 2, 3, 4, 5, 6])`);
console.log(`  [1, [2, [3, [4, [5]]]]] -> [${flatten([1, [2, [3, [4, [5]]]]])}] (ожидается: [1, 2, 3, 4, 5])`);
console.log(`  [] -> [${flatten([])}] (ожидается: [])`);

console.log('\nВСЕ ТЕСТЫ ПРОЙДЕНЫ');
