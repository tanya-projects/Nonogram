'use strict';

//////// MAIN VARIABLES

// Buttons
const restartBtn = document.querySelector('.restart');
const resulttBtn = document.querySelector('.result');
const nextLevelBtn = document.querySelector('.next__level');

// Theme & Rules
const themeIcon = document.querySelector('.theme__icon');
const themeChosen = document.querySelectorAll('.theme__btn');
const themeLabels = document.querySelectorAll('.theme__name');
const themeBtns = document.querySelector('.theme__btns');
const rulesIcon = document.querySelector('.rules__btn');

// Game
const coloredCells = document.querySelectorAll('.cell');
const rows = document.querySelectorAll('.number__left');
const columns = document.querySelectorAll('.number__up');
const levelNumber = document.querySelector('.level__num');

/////// THEME COLOR VARIABLES

const themesData = [
  {
    theme__blue: {
      primaryColor: '#076585',
      primaryColorLight: '#98cee0',
    },
  },
  {
    theme__green: {
      primaryColor: '#00917c',
      primaryColorLight: '#a5f0c5',
    },
  },
  {
    theme__yellow: {
      primaryColor: '#c29200',
      primaryColorLight: '#d6b75a',
    },
  },
];

// Extract Theme Names from all theme data
let themeNames = [];
themesData.forEach((theme) => {
  themeNames.push(Object.keys(theme).toString());
});

// LEVELS DATA

const levels = {
  level1: {
    pic: 'Sand clock',
    rows: [5, 3, 1, [1, 1], 5],
    columns: [
      [1, 1],
      [2, 2],
      [1, 3],
      [2, 2],
      [1, 1],
    ],
  },
  level2: {
    pic: 'Window',
    rows: [5, [1, 1, 1], [1, 3], [1, 1, 1], 5],
    columns: [5, [1, 1, 1], 5, [1, 1], 5],
  },
};

///////// FUNCTIONS

// remove cross sign in empty cell
const removeInnerHTMLInCell = (cell) => {
  // used in cases where !!cell.innerHTML is true
  const insertedCrossInCell = cell.childNodes[0];
  cell.removeChild(insertedCrossInCell);
};

// set Property to :root for theme changer
const changeColorInRootCSS = (variableName, value) => {
  document.documentElement.style.setProperty(variableName, value);
};

// add theme data to local storage and update colors
const changeLocalTheme = () => {
  const localTheme = localStorage.getItem('local_theme');

  const clickedThemeIndex = themeNames.findIndex((data) => data === localTheme);

  changeColorInRootCSS(
    '--primary-color',
    themesData[clickedThemeIndex][localTheme].primaryColor
  );
  changeColorInRootCSS(
    '--primary-color-light',
    themesData[clickedThemeIndex][localTheme].primaryColorLight
  );

  // update label highlight
  themeLabels.forEach((label) => {
    label.classList.remove('active__theme');
    label.checked = false;
    if (label.control.id === localTheme) {
      label.classList.add('active__theme');
      label.checked = true;
    }
  });
};

// add data from levels info
const loadLevelDataInFieldGame = (level, direction) => {
  let block__class, usedDirection;
  if (direction === 'rows') {
    block__class = 'block__left';
    usedDirection = rows;
  } else {
    block__class = 'block__up';
    usedDirection = columns;
  }

  for (let i = 0; i < levels[level][direction].length; i++) {
    if (typeof levels[level][direction][i] === 'number') {
      usedDirection[i].insertAdjacentHTML(
        'afterbegin',
        `<span class="${block__class}">${levels[level][direction][i]}</span>`
      );
    } else {
      for (let n = 0; n < levels[level][direction][i].length; n++) {
        usedDirection[i].insertAdjacentHTML(
          'afterbegin',
          `<span class="${block__class}">${levels[level][direction][i][n]}</span>`
        );
      }
    }
  }
};

// BACKGROUND

// Show theme options
themeIcon.addEventListener('click', (e) => {
  e.preventDefault();
  themeIcon.classList.toggle('open__themes');
});

// Local Storage for theme
if (localStorage.getItem('local_theme')) {
  changeLocalTheme();
  // add white background to used theme
  // console.log(themeLabels);
} else {
  localStorage.setItem('local_theme', 'theme__blue');
}

// Choose theme
themeChosen.forEach((theme) => {
  // remove checked for all inputs

  theme.checked = false;
  // add click event for choosing theme
  theme.addEventListener('click', () => {
    // update local storage data for theme
    localStorage.setItem('local_theme', theme.id);
    // update theme colors
    changeLocalTheme();
  });
});

// RULES

rulesIcon.addEventListener('click', (e) => {
  e.preventDefault();
  rulesIcon.classList.toggle('open__rules');
});

// GAME

// Choose cell
coloredCells.forEach((cell) => {
  cell.addEventListener('click', (e) => {
    e.preventDefault();
    // define cell we click
    const cell = e.target.closest('button');
    // inserted html for cross symbol
    const definedAsEmptyCell = '<i class="bi bi-x-lg inserted"></i>';

    // hide, if any, visible aside data
    themeIcon.classList.remove('open__themes');
    rulesIcon.classList.remove('open__rules');

    if (cell.classList.value.includes('selectedCell')) {
      // add cross inside button for defining this cell as empty (second click on button)
      cell.classList.remove('selectedCell');
      cell.insertAdjacentHTML('afterbegin', definedAsEmptyCell);
    } else if (cell.innerHTML) {
      // remove cross inside button to initial set (third click)
      removeInnerHTMLInCell(cell);
    } else {
      // fill clicked this cell (first click)
      cell.classList.add('selectedCell');
    }
  });
});

// Update level field based on level number
const level = document
  .querySelector('.level')
  .textContent.replace(' ', '')
  .toLowerCase();

loadLevelDataInFieldGame(level, 'rows');
loadLevelDataInFieldGame(level, 'columns');

// Restart button clicked
restartBtn.addEventListener('click', (e) => {
  e.preventDefault();
  console.log(document.querySelectorAll('.inserted'));
  coloredCells.forEach((cell) => {
    cell.classList.remove('selectedCell');

    if (!!cell.innerHTML) {
      const insertedCrossInCell = cell.childNodes[0];
      cell.removeChild(insertedCrossInCell);
    }
  });
});

// Check Result button clicked

resulttBtn.addEventListener('click', (e) => {
  e.preventDefault();
  resulttBtn.disabled = true;
  console.log('result is checking');
  console.log(resulttBtn.disabled);
  // nextLevelBtn.style.display = 'block';
  nextLevelBtn.style.opacity = '100%';
  nextLevelBtn.disabled = false;
});

// check our picture
// if true - show what's on picture and button next level

nextLevelBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const currentLevelNum = Number(levelNumber.textContent);
  levelNumber.textContent = currentLevelNum + 1;
  console.log(levelNumber.textContent);

  nextLevelBtn.style.opacity = 0;
  nextLevelBtn.disabled = true;
});
