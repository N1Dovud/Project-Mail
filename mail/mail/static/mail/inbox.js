document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').addEventListener("submit", submit_email);
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

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}
// Send Mail: When a user submits the email composition form, add JavaScript code to actually send the email.
// You’ll likely want to make a POST request to /emails, passing in values for recipients, subject, and body.
// Once the email has been sent, load the user’s sent mailbox.
async function submit_email(e) {
  e.preventDefault();
  let recipients = document.querySelector("#compose-recipients").value;
  let subject = document.querySelector("#compose-subject").value;
  const body = document.querySelector("#compose-body").value;
  const email = {
    recipients: recipients,
    subject: subject,
    body: body,
  }
  try {
    const response = await fetch("/emails", {
      method: "POST",
      body: JSON.stringify(email) });
    const result = await response.json();
    if (result.message != undefined) {
      alert(result.message);
    } else {
      alert(result.error);
    }
    load_mailbox('sent');
  }
  catch(err) {
    alert("Error:", err.message);
  }
}