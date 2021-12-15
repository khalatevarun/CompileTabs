let myTabs = [
  {
    name: 'Favourite',
    links: [
      'https://roc8.my.stacker.app/your-profile#Cohort%20Submissions',
      'https://roc8.my.stacker.app/your-profile#Cohort%20Submissions',
    ],
  },
];
let currentGroup = 0; // index that points to current group object
const inputEl = document.getElementById('input-el');
const inputBtn = document.getElementById('input-btn');
const contentEl = document.getElementById('content-el');
const leadsFromLocalStorage = JSON.parse(localStorage.getItem('myTabs'));
const deleteBtn = document.getElementById('delete-btn');
const tabBtn = document.getElementById('tab-btn');
const newBtn = document.getElementById('new-btn');
let currentEl = document.getElementById('current-el');
const groupnameEl = document.getElementById('groupname-el');

currentEl.innerHTML = myTabs[currentGroup].name;

if (leadsFromLocalStorage) {
  myTabs = leadsFromLocalStorage;
  render(myTabs);
}

tabBtn.addEventListener('click', function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    myTabs[currentGroup].links.push(tabs[0].url);
    localStorage.setItem('myTabs', JSON.stringify(myTabs));
    render(myTabs);
  });
});

// deleteBtn.addEventListener('dblclick', function () {
//   localStorage.clear();
//   myTabs = [];
//   render(myTabs);
// });

render(myTabs);

inputBtn.addEventListener('click', function () {
  myTabs[currentGroup].links.push(inputEl.value);
  inputEl.value = '';
  localStorage.setItem('myTabs', JSON.stringify(myTabs));
  render(myTabs);
});

newBtn.addEventListener('click', function () {
  myTabs.push({ name: inputEl.value, links: [] });
  currentGroup = myTabs.length - 1;
  currentEl.innerText = inputEl.value;
  inputEl.value = '';
  localStorage.setItem('myTabs', JSON.stringify(myTabs));
  render(myTabs);
});

currentEl.addEventListener('click', function editData(e) {
  const el = e.target;
  const input = document.createElement('input');
  input.setAttribute('value', el.textContent);
  el.replaceWith(input);

  const save = function () {
    const previous = document.createElement(el.tagName.toLowerCase());
    previous.setAttribute('id', 'current-el');
    previous.onclick = editData;
    previous.textContent = input.value;
    input.replaceWith(previous);

    currentEl = previous;
    myTabs[currentGroup].name = input.value;
    render(myTabs);
  };

  input.addEventListener('blur', save, {
    once: true,
  });
  input.focus();
});

document.addEventListener('click', function (e) {
  if (e.target && e.target.id == 'groupname-el') {
    //do something
    currentEl.innerText = e.target.innerText;
    currentGroup = myTabs.findIndex((tabs) => tabs.name == e.target.innerText);
  }

  if (e.target && e.target.id == 'copy-img') {
    let title = myTabs[currentGroup].name;
    let links = '';
    for (let i = 0; i < myTabs[currentGroup].links.length; i++) {
      links += `${i + 1}) ` + myTabs[currentGroup].links[i] + '\n\n';
    }
    navigator.clipboard.writeText(title + '\n\n' + links);
  }
});

function render(groups) {
  let listItems = '';

  for (let i = 0; i < groups.length; i++) {
    console.log(groups);
    listItems += `<h3 id="groupname-el">${groups[i].name}</h3><img  src="copy.png" id="copy-img"/><ul id="ul-el">`;
    for (let j = 0; j < groups[i].links?.length; j++) {
      listItems += `
      <li id="link-el">
          <a target='_blank' href='${groups[i].links[j]}'>
              ${groups[i].links[j]}
          </a>
      </li>
  `;
    }
    listItems += '</ul>';
  }
  contentEl.innerHTML = listItems;
}
