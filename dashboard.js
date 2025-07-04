// Initialize Firebase (Replace with your actual Firebase project config)
const firebaseConfig = {
  apiKey: "AIzaSyDRphDHbeiKomj1Iev6MbrlL4LOj2qg8_s",
  authDomain: "foodvision-9284a.firebaseapp.com",
  databaseURL: "https://foodvision-9284a-default-rtdb.firebaseio.com",
  projectId: "foodvision-9284a",
  storageBucket: "foodvision-9284a.firebasestorage.app",
  messagingSenderId: "49341465857",
  appId: "1:49341465857:web:076a5d14625b6a3a3c8700",
  measurementId: "G-88B6W2388L",
};

firebase.initializeApp(firebaseConfig);
const menuDB = firebase.database().ref("menuItems");

// Utility function to validate item inputs
function validateInput(item) {
  return item && /^[a-zA-Z0-9\s]+$/.test(item);
}

// Function to add a menu item to Firebase
function addMenuItem() {
  const category = document.getElementById("category").value;
  const itemName = document.getElementById("item").value.trim();

  if (validateInput(itemName)) {
    const currentTime = Date.now();
    const deletionTime = currentTime + 48 * 60 * 60 * 1000; // 48 hours in milliseconds

    const newItem = {
      name: itemName,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      deletionTime: deletionTime,
    };

    menuDB.child(category).push(newItem, (error) => {
      if (error) {
        alert("Failed to add menu item. Please try again.");
      } else {
        alert(`Menu item '${itemName}' added successfully!`);
        document.getElementById("item").value = "";
        loadMenuItems();
      }
    });
  } else {
    alert("Invalid input. Only letters, numbers, and spaces are allowed.");
  }
}

// Function to load menu items from Firebase and display them dynamically
function loadMenuItems() {
  const menuContainer = document.getElementById("menuContainer");

  menuDB
    .once("value", (snapshot) => {
      menuContainer.innerHTML = "";

      if (snapshot.exists()) {
        const data = snapshot.val();
        const currentTime = Date.now();

        Object.keys(data).forEach((category) => {
          const section = document.createElement("section");
          const heading = document.createElement("h3");
          heading.textContent = category;
          section.appendChild(heading);

          const table = document.createElement("table");
          table.innerHTML = `<tr><th>#</th><th>Item</th><th>Timestamp</th><th>Actions</th></tr>`;

          const categoryData = data[category];
          const categoryItems = Object.entries(categoryData);

          categoryItems.forEach(([itemId, itemData], index) => {
            const timestamp = itemData.timestamp;
            const formattedTimestamp = new Date(timestamp).toLocaleString();
            const deletionTime = itemData.deletionTime;

            if (currentTime > deletionTime) {
              // Item deletion time has passed, remove it from Firebase
              removeItem(category, itemId);
              return; // Skip adding this item to the table
            }

            const row = document.createElement("tr");
            row.innerHTML = `
              <td>${index + 1}</td>
              <td>${itemData.name}</td>
              <td>${formattedTimestamp}</td>
              <td><button onclick="removeItem('${category}', '${itemId}')">Remove</button></td>
            `;
            table.appendChild(row);
          });

          section.appendChild(table);
          menuContainer.appendChild(section);
        });
      } else {
        console.error("No data found in the database.");
        menuContainer.innerHTML =
          "<p>No menu items found. Please add some.</p>";
      }
    })
    .catch((error) => {
      console.error("Error fetching data from Firebase:", error);
    });
}

// Function to remove a menu item from Firebase
function removeItem(category, key) {
  menuDB
    .child(category)
    .child(key)
    .remove((error) => {
      if (error) {
        alert("Failed to remove the item. Please try again.");
      } else {
        console.log("Item removed successfully.");
        loadMenuItems();
      }
    });
}

// Function to reset all menu items
function resetMenu() {
  const confirmation = confirm(
    "Are you sure you want to reset the entire menu? This will remove all menu items."
  );
  if (confirmation) {
    menuDB
      .remove() // Remove data from Firebase
      .then(() => {
        localStorage.removeItem("menuItems");
        loadMenuItems();
      })
      .catch((error) => {
        alert("Error resetting menu items: " + error.message);
        console.error("Error resetting menu items:", error);
      });
  }
}

// Load username from localStorage (if applicable)
function loadUsername() {
  const username = localStorage.getItem("admin");
  document.getElementById("username").textContent = username
    ? `Welcome, ${username}!`
    : "Welcome!";
}

// Ensure elements exist before adding event listeners
document.addEventListener("DOMContentLoaded", () => {
  const addButton = document.getElementById("addButton");
  const resetButton = document.getElementById("resetButton");

  if (addButton) {
    addButton.addEventListener("click", addMenuItem);
  }

  if (resetButton) {
    resetButton.addEventListener("click", resetMenu);
  }

  loadUsername();
  loadMenuItems();

  // Periodic check for expired items (every hour)
  setInterval(loadMenuItems, 60 * 60 * 1000);
});
