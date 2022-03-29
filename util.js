const salties = [      
    'Abel.jpeg',     'Alejandro.jpeg',
    'Alex H.png',     'Alex S.jpeg',   'Anu.jpeg',
    'Barbara.png',    'Beatrice.jpeg', 'Calle.jpeg',
    'Christina.jpeg', 'David.jpeg',    'Dovlat.png',
    'Erik.jpeg',      'Ersan.jpeg',    'Fabrizio.png',
    'Frans.png',      'Guian.jpeg',    'Isa.jpeg',
    'Isabelle.png',   'Ivan.jpeg',     'Izabela.jpeg',
    'Jimmy.jpeg',     'Joan.png',      'Johan E.jpeg',
    'Johan K.jpeg',   'Johannes.jpeg', 'Josephine.jpeg',
    'Kevin.jpeg',     'Krishna.jpeg',  'Leila.png',
    'Ludwig.jpeg',    'Marina.jpeg',   'Martin.png',
    'Micky.jpeg',     'Natalia.jpeg',  'Nathalie.png',
    'Negar.jpeg',     'Nemanja.jpeg',  'Oscar.jpeg',
    'Patrycja.jpeg',  'Roeline.png',   'Samuel.jpeg',
    'Sandra.png',     'Seyf.jpeg',     'Snehal.jpeg',
    'Sumana.png',     'Syed.jpeg',     'Thomas.png',
    'Tianbiao.jpeg'
  ];
  
const fifteenRandomNumbers = () => {
  const generateRandomNumber = (min, max) => Math.floor(Math.random() * (max - min) + min);
  const max = salties.length;
  const min = 0;
  let result = [];
  while(result.length < 3) {
      const randomNum = generateRandomNumber(min, max);
      if(!result.find(num => num === randomNum)){
          result.push(randomNum);
      }
  }
  return result;
}

const randomSalties = () => {
    const people = [];
    const randoms = fifteenRandomNumbers();
    randoms.forEach((number, index) => {
        const obj = {
            name: salties[number].split('.')[0],
            image: salties[number],
            id: index,
            isTheOne: false,
          }
      people.push(obj);
    });
    return people;
}

module.exports.randomSalties = randomSalties;