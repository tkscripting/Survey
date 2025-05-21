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
  
  // Track signed-in user
  let currentUser = null;
  const reviewerUIDs = [
    "hb4pd6A2nvNTCUX39vBTvVsET5q1"
  ];
  
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
  
  // Data arrays
  const scripts = [
    "Better Scrolling", "Clear Colors", "Filter By Color & Name", "Odd One Out", "Optimize List",
    "PID Adder", "PID to VID Search", "Refresh Search", "Retouching Extras", "Runway Check", "VID Comparison"
  ];
  const actions = [
    "Templater", "Swatcher", "Averager", "FJ Swatcher", "Uploader",
    "Multi-Uploader", "Index Uploader", "Press Maker", "Easy Emails"
  ];
  const allOptions = [...scripts, ...actions];
  
  // Init on page load
  document.addEventListener("DOMContentLoaded", () => {
    initializeSurveyLists();
  
    const modal = document.getElementById("results-modal");
    modal.addEventListener("click", function (event) {
      if (event.target === modal) toggleResults();
    });
  });
  
  function initializeSurveyLists() {
    initSortableList("sortable-scripts", scripts);
    initSortableList("sortable-actions", actions);
    addFeedbackGroup(); // One feedback section by default
    addSuggestionGroup();
  }
  
  function initSortableList(listId, itemArray) {
    const list = document.getElementById(listId);
    if (!list) return;
  
    function createListItem(text) {
      const li = document.createElement("li");
      li.className = "draggable-item";
      li.draggable = true;
  
      const number = document.createElement("span");
      number.className = "rank-label";
      number.textContent = "";
  
      const label = document.createElement("span");
      label.textContent = text;
  
      li.appendChild(number);
      li.appendChild(label);
      addDragEvents(li);
      return li;
    }
  
    function updateNumbers() {
      const items = list.querySelectorAll(".draggable-item");
      items.forEach((item, i) => {
        item.querySelector(".rank-label").textContent = i + 1;
      });
    }
  
    let draggedItem = null;
  
    function addDragEvents(item) {
      let hoverTimeout;
  
      item.addEventListener("dragstart", () => {
        draggedItem = item;
        setTimeout(() => (item.style.display = "none"), 0);
      });
  
      item.addEventListener("dragend", () => {
        setTimeout(() => {
          item.style.display = "flex";
          document.querySelectorAll(".drag-over").forEach(el => el.classList.remove("drag-over"));
          updateNumbers();
          draggedItem = null;
        }, 0);
      });
  
      item.addEventListener("dragover", e => {
        e.preventDefault();
        if (item !== draggedItem) {
          clearTimeout(hoverTimeout);
          item.classList.add("drag-over");
        }
      });
  
      item.addEventListener("dragleave", () => {
        hoverTimeout = setTimeout(() => {
          item.classList.remove("drag-over");
        }, 100);
      });
  
      item.addEventListener("drop", function () {
        item.classList.remove("drag-over");
        if (draggedItem !== this) {
          const items = [...list.querySelectorAll(".draggable-item")];
          const draggedIndex = items.indexOf(draggedItem);
          const targetIndex = items.indexOf(this);
          if (draggedIndex < targetIndex) {
            list.insertBefore(draggedItem, this.nextSibling);
          } else {
            list.insertBefore(draggedItem, this);
          }
          updateNumbers();
        }
      });
    }
  
    itemArray.forEach(text => list.appendChild(createListItem(text)));
    updateNumbers();
  }
  
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
    label1.textContent = "Select item:";
    label1.appendChild(select);
  
    const label2 = document.createElement("label");
    label2.textContent = "Feedback:";
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
        What kind of item is it?
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
        Briefly describe it:
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
  
    const scriptItems = [...document.querySelectorAll("#sortable-scripts .draggable-item")];
    const actionItems = [...document.querySelectorAll("#sortable-actions .draggable-item")];
    const rankedScripts = scriptItems.map(item => item.querySelector("span:nth-child(2)").textContent);
    const rankedActions = actionItems.map(item => item.querySelector("span:nth-child(2)").textContent);
  
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
      rankedScripts,
      rankedActions,
      feedbackEntries,
      suggestions,
      timestamp: new Date()
    })
      .then(() => {
        submitBtn.classList.remove("error");
        submitBtn.classList.add("success");
        submitBtn.textContent = "Submitted!";
  
        // Reset everything
        document.getElementById("sortable-scripts").innerHTML = "";
        document.getElementById("sortable-actions").innerHTML = "";
        initSortableList("sortable-scripts", scripts);
        initSortableList("sortable-actions", actions);
  
        const feedbackContainer = document.getElementById("feedback-group-container");
        feedbackContainer.innerHTML = "";
        addFeedbackGroup();
  
        const suggestionContainer = document.getElementById("suggestion-group-container");
        suggestionContainer.innerHTML = "";
        document.querySelectorAll(".suggestion-entry").forEach(e => e.remove());
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
    const modal = document.getElementById("results-modal");
  
    if (!currentUser || !reviewerUIDs.includes(currentUser.uid)) {
      showAccessDeniedMessage();
      if (button) flashButtonEffect(button, "error");
      return;
    }
  
    if (button) flashButtonEffect(button, "info");
  
    if (modal.style.display === "flex") {
      modal.style.display = "none";
    } else {
      modal.style.display = "flex";
      loadResults();
    }
  }  
  
  function showAccessDeniedMessage() {
    const msg = document.createElement("div");
    msg.textContent = "Access denied. You're not authorized to view results.";
  
    Object.assign(msg.style, {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      background: "rgba(255, 0, 0, 0.1)",
      color: "#a00",
      padding: "1.25rem 2rem",
      borderRadius: "16px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
      fontSize: "1.1rem",
      fontWeight: "500",
      zIndex: "1000",
      backdropFilter: "blur(8px)",
      border: "1px solid rgba(255,0,0,0.2)",
      textAlign: "center"
    });
  
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
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
  
        // === Ranking aggregation ===
        const scriptScores = {};
        const actionScores = {};
        const scriptCounts = {};
        const actionCounts = {};
  
        results.forEach(entry => {
          entry.rankedScripts?.forEach((script, index) => {
            scriptScores[script] = (scriptScores[script] || 0) + index + 1;
            scriptCounts[script] = (scriptCounts[script] || 0) + 1;
          });
  
          entry.rankedActions?.forEach((action, index) => {
            actionScores[action] = (actionScores[action] || 0) + index + 1;
            actionCounts[action] = (actionCounts[action] || 0) + 1;
          });
        });
  
        const avgScripts = Object.entries(scriptScores).map(([name, total]) => ({
          name,
          avg: total / scriptCounts[name]
        })).sort((a, b) => a.avg - b.avg);
  
        const avgActions = Object.entries(actionScores).map(([name, total]) => ({
          name,
          avg: total / actionCounts[name]
        })).sort((a, b) => a.avg - b.avg);
  
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
        <div style="display:flex; width:100%; height:100%;">
      
          <!-- Left: Data View -->
          <div style="width:50%; display:flex; justify-content:center; align-items:center; padding:2rem;">
            <div style="width:100%; max-width:500px;">
              <section style="background:#e0f7fa; padding:1rem 1.5rem; border-radius:12px; margin-bottom:1rem;">
                <h2 style="margin-bottom:0.75rem;">Top Ranked Scripts</h2>
                <ol style="margin:0; padding-left:1.5rem;">
                  ${avgScripts.map(s => `<li style="margin-bottom:0.4rem;">${s.name}</li>`).join("")}
                </ol>
              </section>
      
              <section style="background:#ede7f6; padding:1rem 1.5rem; border-radius:12px; margin-bottom:1rem;">
                <h2 style="margin-bottom:0.75rem;">Top Ranked Actions</h2>
                <ol style="margin:0; padding-left:1.5rem;">
                  ${avgActions.map(a => `<li style="margin-bottom:0.4rem;">${a.name}</li>`).join("")}
                </ol>
              </section>
      
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
            </div>
          </div>
      
          <!-- Right: Placeholder for Graphics -->
          <div style="width:50%; display:flex; justify-content:center; align-items:center; padding:2rem;">
            <div id="results-graphics" style="text-align:center;">
              <p style="font-size:1rem; color:#666;">[Visual data graphics coming soon!]</p>
              <canvas id="resultsChart" width="300" height="300" style="margin-top:1rem;"></canvas>
            </div>
          </div>
      
        </div>
      `;      

        container.innerHTML = "";
        container.appendChild(summary);
      })
      .catch(err => {
        container.innerHTML = "<p>Error loading results.</p>";
        console.error(err);
      });
  }
  
  
  document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("results-modal");
  
    modal.addEventListener("click", function (event) {
      if (event.target === modal) {
        modal.style.display = "none"; // 👈 directly close, no toggle logic
      }
    });
  });

  function generateDynamicColor() {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 30) + 50; // 50–80%
    const lightness = Math.floor(Math.random() * 20) + 70; // 70–90%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }
  
  function createShapes(containerId, densityFactor, sizeRange, opacity, parallaxFactor) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
  
    const shapes = ["circle", "rectangle"];
    const containerWidth = window.innerWidth;
    const scrollHeight = document.body.scrollHeight;
    const viewportHeight = window.innerHeight;
    const availableHeight = Math.max(scrollHeight, viewportHeight);
  
    // ✅ Insert the new shape count logic here:
    const pixelsPerShape = 400 / densityFactor;
    const count = Math.floor((availableHeight * 1.5) / pixelsPerShape);
  
    // ✅ NEW layout loop goes here:
    for (let i = 0; i < count; i++) {
      const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
      const color = generateDynamicColor();
      const size = Math.floor(Math.random() * (sizeRange[1] - sizeRange[0])) + sizeRange[0];
  
      const x = Math.random() * (containerWidth - size);
  
      // Even vertical spread using per-shape zones
      const zoneHeight = (availableHeight * 1.5) / count;
      const baseY = i * zoneHeight;
      const y = baseY + Math.random() * (zoneHeight - size);
  
      const shape = document.createElement("div");
      shape.classList.add("shape", shapeType);
      shape.style.width = `${size}px`;
      shape.style.height = `${size}px`;
      shape.style.backgroundColor = color;
      shape.style.opacity = opacity;
      shape.style.left = `${x}px`;
      shape.style.top = `${y}px`;
      shape.dataset.offset = y;
      shape.dataset.parallax = parallaxFactor;
      shape.style.transform = `rotate(${Math.floor(Math.random() * 360)}deg)`;
  
      container.appendChild(shape);
    }
  }  
  
  function applyParallax() {
    const scrollY = window.scrollY;
    document.querySelectorAll(".background-shapes .shape").forEach(shape => {
      const baseTop = parseFloat(shape.dataset.offset || 0);
      const factor = parseFloat(shape.dataset.parallax || 0.1);
      shape.style.top = `${baseTop - scrollY * factor}px`;
    });
  }
  
  window.addEventListener("load", () => {
    createShapes("backgroundLayer2", 1.5, [150, 220], 0.35, 0.07, "random"); // BACK: more scattered
    createShapes("backgroundLayer1", 1, [280, 400], 0.6, 0.15, "grid");      // FRONT: more structured
    window.addEventListener("scroll", applyParallax);
  });
  
