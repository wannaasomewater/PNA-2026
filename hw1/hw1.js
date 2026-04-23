
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

// 3.4
// Сортировка букв в словах и слов в предложении

function sort(sentence) {
    const words = sentence.split(/\s+/);

    const sortedWords = words.map(word => {
        const letters = word.toLowerCase().split('');
        letters.sort();
        const sorted = letters.join('');

        if (sorted.length > 0) {
            return sorted.charAt(0).toUpperCase() + sorted.slice(1);
        }
        return sorted;
    });

    sortedWords.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

    return sortedWords.join(' ');
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

console.log('\n3.4 Сортировка слов и букв:');
console.log(`  "привет мир как дела" -> "${sort('привет мир как дела')}"`);
console.log(`  "hello world" -> "${sort('hello world')}"`);
console.log(`  "кот ток сон нос" -> "${sort('кот ток сон нос')}"`);
console.log(`  "я изучаю javascript" -> "${sort('я изучаю javascript')}"`);

console.log('\nВСЕ ТЕСТЫ ПРОЙДЕНЫ');
