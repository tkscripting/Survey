import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC09qGkeqtH0aCnWwr8hXq13vaGuBjhkBE",
  authDomain: "survey-e58d2.firebaseapp.com",
  projectId: "survey-e58d2",
  storageBucket: "survey-e58d2.appspot.com",
  messagingSenderId: "931174105381",
  appId: "1:931174105381:web:6254fd5b4a8eb4d0945acc",
  measurementId: "G-6NDF8KBEM1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.submitSurvey = async function () {
  const name = document.getElementById("name").value.trim();
  const satisfaction = document.getElementById("satisfaction").value;
  const feedback = document.getElementById("feedback").value.trim();
  const messageEl = document.getElementById("message");

  if (!name || !satisfaction || !feedback) {
    messageEl.textContent = "Please fill out all fields.";
    messageEl.style.color = "red";
    return;
  }

  try {
    await addDoc(collection(db, "responses"), {
      name,
      satisfaction,
      feedback,
      timestamp: new Date()
    });
    messageEl.style.color = "green";
    messageEl.textContent = "Thank you for your feedback!";
    document.querySelector("form").reset();
  } catch (error) {
    messageEl.style.color = "red";
    messageEl.textContent = "Error submitting survey.";
    console.error("Firebase submission error:", error);
  }
};
