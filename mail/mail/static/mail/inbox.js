let emailsBox;

document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  //Attaching event handler when submitting email form
  document.querySelector('#compose-form').addEventListener("submit", submit_email);

  //globally get the div for containing emails
  emailsBox = document.querySelector("#emails-view");

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

async function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  get_mailbox(mailbox);
}


// function for submitting an email
async function submit_email(e) {

  // prevent default behaviour
  e.preventDefault();

  // get the values
  let recipients = document.querySelector("#compose-recipients").value;
  let subject = document.querySelector("#compose-subject").value;
  const body = document.querySelector("#compose-body").value;

  // create the needed object
  const email = {
    recipients: recipients,
    subject: subject,
    body: body,
  }

  try {
    // do the fetching
    const response = await fetch("/emails", {
      method: "POST",
      body: JSON.stringify(email) });
    const result = await response.json();

    //tell the user whether everything worked fine
    if (result.message != undefined) {
      alert(result.message);
    } else {
      alert(result.error);
    }
    load_mailbox('sent');
  }
  //in case something goes wrong
  catch(err) {
    alert("Error:", err.message);
  }
}

//rendering emails list depending on the mailbox type
async function get_mailbox(mailbox_type) {

  // let's try smth
  try {
    //clear the emails box first
    emailsBox.innerHTML = `<h3 style="padding: 0.5rem 3rem; font-size: 2rem; font-weight: bold;">${mailbox_type.charAt(0).toUpperCase() + mailbox_type.slice(1)}</h3>`;

    // get the emails filtered according to the mailbox type
    const response_raw = await fetch(`/emails/${mailbox_type}`);
    const responseArray = await response_raw.json();


    // if I sent the wrong mailbox type
    if (responseArray.error !== undefined) {
      alert(responseArray.error);
    } else {
      if (responseArray.length !== 0) {
        //create email divs
      responseArray.forEach(response => create_emails(response, mailbox_type));
      } else {
        emailsBox.innerHTML += '<div style="padding: 2rem 0; text-align: center; font-size:2rem; font-weight: bold;">Nothing for now!</div>';
      }
    }
  }

  // just in case
  catch(err) {
    alert(err.message);
    console.log(err.message);
  }
}

const create_emails = (response, mailbox_type) => {

    //creating a div
    let new_div = document.createElement("div");

    //giving an id attribute
    new_div.setAttribute("data-id", response.id);

    //adding a class
    new_div.classList.add("email");

    //putting the right email depending on whether the user was sender
    if (mailbox_type == "sent") {
      new_div.innerHTML = `<span class="email-address">${response.recipients.join(", ")}</span><span class="subject">${response.subject}</span><span class="date">${response.timestamp}</span>`;
    } else {
      new_div.innerHTML = `<span class="email-address">${response.sender}</span><span class="subject">${response.subject}</span><span class="date">${response.timestamp}</span>`;
    }

    //handling the background color according to the read status
    new_div.style.backgroundColor = response.read ? "#d3d3d3" : "white";

    //appending to the box
    emailsBox.append(new_div);
}