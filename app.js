function fizzBuzz() {
  for(i=1; i<=100; i++){
    if(i%3 === 0 && i%5 === 0){
      console.log("fizzBuzz");
    }else if(i%3 === 0){
      console.log("fizzBuzz");
    }else if(i%5 === 0){
      console.log("fizzBuzz");
    }else{
      console.log(i);
    }
  }
}
fizzBuzz();
