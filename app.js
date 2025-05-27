// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC09qGkeqtH0aCnWwr8hXq13vaGuBjhkBE",
  authDomain: "survey-e58d2.firebaseapp.com",
  projectId: "survey-e58d2",
  storageBucket: "survey-e58d2.firebasestorage.app",
  messagingSenderId: "931174105381",
  appId: "1:931174105381:web:6254fd5b4a8eb4d0945acc",
  measurementId: "G-6NDF8KBEM1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let currentUser = null;
let hasAccess = false;

auth.onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    console.log("Signed in as:", user.uid);
  } else {
    auth.signInAnonymously().catch(err => {
      console.error("Anonymous sign-in failed:", err.message);
    });
  }
});

const allOptions = [
  "Better Scrolling", "Clear Colors", "Filter By Color & Name", "Odd One Out", "Optimize List",
  "PID Adder", "PID to VID Search", "Refresh Search", "Retouching Extras", "Runway Check", "VID Comparison",
  "Templater", "Swatcher", "Averager", "FJ Swatcher", "Uploader",
  "Multi-Uploader", "Index Uploader", "Press Maker", "Easy Emails"
];

document.addEventListener("DOMContentLoaded", () => {
  addFeedbackGroup();
  addSuggestionGroup();
});

function flashButtonEffect(button, className) {
  button.classList.add(className);
  setTimeout(() => {
    button.classList.remove(className);
  }, 300);
}

function addFeedbackGroup(button) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("feedback-entry");

  const container = document.getElementById("feedback-group-container");
  if (container.children.length > 0) {
    wrapper.classList.add("entry-block");
  }

  const select = document.createElement("select");
  select.innerHTML = `<option value="">Choose a Script or Action</option>` +
    allOptions.map(opt => `<option value="${opt}">${opt}</option>`).join("") +
    `<option value="Other">Other</option>`;

  const textarea = document.createElement("textarea");
  textarea.placeholder = "";

  const label1 = document.createElement("label");
  label1.textContent = "Select item";
  label1.appendChild(select);

  const label2 = document.createElement("label");
  label2.textContent = "Feedback";
  label2.appendChild(textarea);

  wrapper.appendChild(label1);
  wrapper.appendChild(label2);

  container.appendChild(wrapper);

  if (button) flashButtonEffect(button, "success");
}

function removeFeedbackGroup(button) {
  const container = document.getElementById("feedback-group-container");
  const entries = container.querySelectorAll(".feedback-entry");
  if (entries.length > 1) {
    container.removeChild(entries[entries.length - 1]);
    if (button) flashButtonEffect(button, "error");
  }
}

function addSuggestionGroup(button) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("suggestion-entry");

  const container = document.getElementById("suggestion-group-container");
  if (container.children.length > 0) {
    wrapper.classList.add("entry-block");
  }

  wrapper.innerHTML = `
    <label>
      What is it?
      <select class="suggest-type">
        <option value="">Select one</option>
        <option value="Madame Script">Madame Script</option>
        <option value="Photoshop Action">Photoshop Action</option>
        <option value="App">App</option>
        <option value="Other">Other</option>
      </select>
    </label>
    <label>
      What would it be called?
      <input type="text" class="suggest-name" />
    </label>
    <label>
      What would it do?
      <textarea class="suggest-description"></textarea>
    </label>
  `;

  container.appendChild(wrapper);

  if (button) flashButtonEffect(button, "success");
}

function removeSuggestionGroup(button) {
  const container = document.getElementById("suggestion-group-container");
  const entries = container.querySelectorAll(".suggestion-entry");
  if (entries.length > 1) {
    container.removeChild(entries[entries.length - 1]);
    if (button) flashButtonEffect(button, "error");
  }
}

function submitSurvey() {
  const submitBtn = document.getElementById("submitBtn");

  const feedbackEntries = [...document.querySelectorAll(".feedback-entry")].map(entry => {
    return {
      item: entry.querySelector("select").value,
      feedback: entry.querySelector("textarea").value.trim()
    };
  }).filter(e => e.item && e.feedback);

  const suggestions = [...document.querySelectorAll(".suggestion-entry")].map(entry => {
    return {
      type: entry.querySelector(".suggest-type").value,
      name: entry.querySelector(".suggest-name").value.trim(),
      description: entry.querySelector(".suggest-description").value.trim()
    };
  }).filter(s => s.type && s.name && s.description);

  if (!currentUser) {
    submitBtn.classList.remove("success");
    submitBtn.classList.add("error");
    submitBtn.textContent = "Auth Error";
    setTimeout(() => {
      submitBtn.classList.remove("error");
      submitBtn.textContent = "Submit";
    }, 3000);
    return;
  }

  db.collection("featureFeedback").add({
    uid: currentUser.uid,
    feedbackEntries,
    suggestions,
    timestamp: new Date()
  })
    .then(() => {
      submitBtn.classList.remove("error");
      submitBtn.classList.add("success");
      submitBtn.textContent = "Submitted!";

      const feedbackContainer = document.getElementById("feedback-group-container");
      feedbackContainer.innerHTML = "";
      addFeedbackGroup();

      const suggestionContainer = document.getElementById("suggestion-group-container");
      suggestionContainer.innerHTML = "";
      addSuggestionGroup();

      setTimeout(() => {
        submitBtn.classList.remove("success");
        submitBtn.textContent = "Submit";
      }, 3000);
    })
    .catch(err => {
      submitBtn.classList.remove("success");
      submitBtn.classList.add("error");
      submitBtn.textContent = "Error Submitting";
      console.error(err);

      setTimeout(() => {
        submitBtn.classList.remove("error");
        submitBtn.textContent = "Submit";
      }, 3000);
    });
}

function toggleResults(button) {
  if (hasAccess) {
    document.getElementById("results-modal").style.display = "flex";
    loadResults();
    return;
  }

  const modal = document.getElementById("password-modal");
  const input = document.getElementById("results-password-input");
  const buttonEl = document.getElementById("password-submit-btn");

  modal.style.display = "flex";
  input.value = "";
  buttonEl.textContent = "Submit";
  buttonEl.classList.remove("error");

  setTimeout(() => input.focus(), 50);

  if (button) flashButtonEffect(button, "info");
}

function closePasswordModal() {
  document.getElementById("password-modal").style.display = "none";
}

function submitPassword(event) {
  event.preventDefault();
  const input = document.getElementById("results-password-input");
  const button = document.getElementById("password-submit-btn");
  const correctPassword = "1280";

  if (input.value === correctPassword) {
    hasAccess = true;
    closePasswordModal();
    document.getElementById("results-modal").style.display = "flex";
    loadResults();

    button.textContent = "Submit";
    button.classList.remove("error");
  } else {
    button.textContent = "Incorrect";
    button.classList.add("error");
    setTimeout(() => {
      button.textContent = "Submit";
      button.classList.remove("error");
    }, 2500);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("password-form").addEventListener("submit", submitPassword);
  document.getElementById("password-modal").addEventListener("click", event => {
    if (event.target === document.getElementById("password-modal")) {
      closePasswordModal();
    }
  });
  document.getElementById("results-modal").addEventListener("click", event => {
    if (event.target === document.getElementById("results-modal")) {
      closeResultsModal();
    }
  });
  document.querySelector("#results-modal .close-btn").addEventListener("click", closeResultsModal);
});

function closeResultsModal() {
  document.getElementById("results-modal").style.display = "none";
}
function loadResults() {
  const container = document.getElementById("results-container");
  container.innerHTML = "<p>Loading results...</p>";

  db.collection("featureFeedback")
    .get()
    .then(snapshot => {
      const results = snapshot.docs.map(doc => doc.data());
      const submissionCount = snapshot.docs.length;

      if (!results.length) {
        container.innerHTML = "<p>No submissions yet.</p>";
        return;
      }

      // === Group Feedback ===
      const feedbackMap = {};
      results.forEach(entry => {
        entry.feedbackEntries?.forEach(fb => {
          if (!feedbackMap[fb.item]) feedbackMap[fb.item] = [];
          feedbackMap[fb.item].push(fb.feedback);
        });
      });

      // === Group Suggestions ===
      const suggestionsMap = {};
      results.forEach(entry => {
        entry.suggestions?.forEach(s => {
          const key = `${s.type}::${s.name}::${s.description}`;
          suggestionsMap[key] = s;
        });
      });

      // === Render ===
      const summary = document.createElement("div");
      summary.style.maxWidth = "100%";
      summary.style.margin = "0 auto";
      summary.style.padding = "2rem";

      summary.innerHTML = `
        <h1 style="text-align:center; margin-bottom:0.5rem; font-size:2rem;">Survey Results</h1>
        <p style="text-align:center; margin-bottom:2rem; font-size:1rem; color:#555;">Based on ${submissionCount} submission${submissionCount !== 1 ? "s" : ""}</p>
        <section style="background:#fff3e0; padding:1rem 1.5rem; border-radius:12px; margin-bottom:1rem;">
          <h2 style="margin-bottom:0.75rem;">Feedback</h2>
          ${Object.entries(feedbackMap).map(([item, feedbacks]) => `
            <div style="margin-bottom:1rem;">
              <strong>${item}</strong>
              <ul style="padding-left:1.5rem; margin:0.5rem 0;">
                ${feedbacks.map(f => `<li>${f}</li>`).join("")}
              </ul>
            </div>
          `).join("")}
        </section>

        <section style="background:#e8f5e9; padding:1rem 1.5rem; border-radius:12px;">
          <h2 style="margin-bottom:0.75rem;">Suggestions</h2>
          <ul style="padding-left:1.5rem; margin:0;">
            ${Object.values(suggestionsMap).map(s => `
              <li><strong>${s.name}</strong> <em>(${s.type})</em>: ${s.description}</li>
            `).join("")}
          </ul>
        </section>
      `;

      container.innerHTML = "";
      container.appendChild(summary);
    })
    .catch(err => {
      container.innerHTML = "<p>Error loading results.</p>";
      console.error(err);
    });
}
