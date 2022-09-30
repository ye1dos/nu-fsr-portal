const convertToMasked = (num) => {
    if (!num) {
        return 0;
    }
    const arr = num.toString().split('').reverse();
    const maskedArr = [];
    console.log(arr);
    if (arr.length > 3) {
        for (let i = 0; i < arr.length; i++ ) {
            if (i % 3 === 0) {
                maskedArr.push(arr[i] + ' ');
                continue;
            }
            maskedArr.push(arr[i]);
        }
    }
    else {
        return num.toString();
    }
    console.log(maskedArr);
    return maskedArr.reverse().join('');
}
export default convertToMasked;