export const addThousandsSeparator = (num) => {
    if(num == null || isNaN(num)) return "";

    //convert number to string to handle decimals
    const numStr = num.toString();
    const parts = numStr.split('.'); //split into integer and functional parts

    let integerPart = parts[0];
    let fractionalPart = parts[1];

    //Regex for Indian numbering System
    // It handles the first three digits,them every two digits
    const lastThree = integerPart.substring(integerPart.length -3);
    const otherNumbers = integerPart.substring(0,integerPart.length-3);

    if(otherNumbers !== ''){
        //Apply comma after every two digits for the 'otherNumbers' part
        const formattedOtherNumbers= otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g,',');
        integerPart= formattedOtherNumbers + ',' + lastThree;
    }else{
        integerPart = lastThree; // no change if less than 4 digits
    }
    return fractionalPart ? `${integerPart}.${fractionalPart}` : integerPart;
}