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
const deleteEl = document.getElementById('delete-img');
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

deleteEl.addEventListener('dblclick', function () {
  myTabs = myTabs.filter((tab) => tab.name != myTabs[currentGroup].name);
  currentGroup = 0;
  currentEl.innerHTML = myTabs[currentGroup].name;
  localStorage.setItem('myTabs', JSON.stringify(myTabs));
  render(myTabs);
});

function is_url(str) {
  regexp =
    /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  if (regexp.test(str)) {
    return true;
  } else {
    return false;
  }
}

render(myTabs);

inputBtn.addEventListener('click', function () {
  if (is_url(inputEl.value)) {
    if (
      myTabs[currentGroup].links.findIndex((link) => link == inputEl.value) ==
      -1
    ) {
      myTabs[currentGroup].links.push(inputEl.value);
      inputEl.value = '';
      localStorage.setItem('myTabs', JSON.stringify(myTabs));
      render(myTabs);
    } else {
      //display error saying that the link already exists in the current group
    }
  } else {
    //display error saying that the url is not valid.
  }
});

newBtn.addEventListener('click', function () {
  if (
    myTabs.findIndex(
      (tabs) => tabs.name.toLowerCase() == inputEl.value.toLowerCase()
    ) == -1
  ) {
    myTabs.push({ name: inputEl.value, links: [] });
    currentGroup = myTabs.length - 1;
    currentEl.innerText = inputEl.value;
    inputEl.value = '';
    localStorage.setItem('myTabs', JSON.stringify(myTabs));
    render(myTabs);
  } else {
    // display error that this name already exists
  }
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
    localStorage.setItem('myTabs', JSON.stringify(myTabs));
    render(myTabs);
  };

  input.addEventListener('blur', save, {
    once: true,
  });
  input.focus();
});

document.addEventListener('click', function (e) {
  console.log('EVENT>>>', e.target);
  if (e.target && e.target.id == 'groupname-el') {
    //do something
    currentEl.innerText = e.target.innerText;
    currentGroup = myTabs.findIndex((tabs) => tabs.name == e.target.innerText);
    render(myTabs);
  } else if (e.target && e.target.id == 'copy-img') {
    let title = myTabs[currentGroup].name;
    let links = '';
    for (let i = 0; i < myTabs[currentGroup].links.length; i++) {
      links += `${i + 1}) ` + myTabs[currentGroup].links[i] + '\n\n';
    }
    navigator.clipboard.writeText(title + '\n\n' + links);
  } else if (e.target && e.target.id == 'remove-el') {
    myTabs = myTabs[currentGroup].links.filter(
      (link) => link == 'add a condition'
    );
    // call render method
  }
});

function render(groups) {
  let listItems = '';

  console.log(groups);

  if (groups.length == 1) {
    deleteEl.style.display = 'none';
  } else {
    deleteEl.style.display = 'inline';
  }

  for (let i = 0; i < groups.length; i++) {
    console.log(groups);
    listItems += `<h3 id="groupname-el">${groups[i].name}</h3><ul id="ul-el">`;
    for (let j = 0; j < groups[i].links?.length; j++) {
      listItems += `
      <li id="link-el">
          <a target='_blank' href='${groups[i].links[j]}'>
              ${groups[i].links[j]}
          </a>${
            i == currentGroup ? "<img src='remove.png' id='remove-el'/>" : ''
          }
      </li>
  `;
    }
    listItems += '</ul>';
  }
  contentEl.innerHTML = listItems;
}
