// Lesson 11 practice: callbacks, promises, async/await
// Run with: node async-practice.js

// ---------- Task 11.1: predict the output ----------
// A, C, E print first (synchronous). Then B (0 ms timer), then D (100 ms timer).
console.log("A");
setTimeout(() => console.log("B"), 0);
console.log("C");
setTimeout(() => console.log("D"), 100);
console.log("E");

// Callback pattern: simulate a 1.5 second database lookup
function loadUser(userId, callback) {
    setTimeout(() => {
        callback({ id: userId, name: "John", age: 30 });
    }, 1500);
}

// ---------- Task 11.2: promise versions ----------
function getUserData(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (userId > 0) {
                resolve({ id: userId, name: "John" });
            } else {
                reject("Invalid user ID");
            }
        }, 1000);
    });
}

function getUserPosts(userId) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 1, title: "Post 1" },
                { id: 2, title: "Post 2" }
            ]);
        }, 1000);
    });
}

function getPostComments(postId) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 1, text: "Great post!" },
                { id: 2, text: "Thanks for sharing" }
            ]);
        }, 1000);
    });
}

// ---------- Task 11.3: chaining, Promise.all, Promise.race ----------
function chainExample() {
    return getUserData(1)
        .then((user) => {
            console.log("User:", user);
            return getUserPosts(user.id);
        })
        .then((posts) => {
            console.log("Posts:", posts);
            return getPostComments(posts[0].id);
        })
        .then((comments) => {
            console.log("Comments:", comments);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

// Fetch 3 users at the same time and show them all at once
function fetchThreeUsers() {
    return Promise.all([getUserData(1), getUserData(2), getUserData(3)])
        .then((users) => console.log("All users:", users))
        .catch((error) => console.error("One failed:", error));
}

function raceExample() {
    const fast = new Promise((resolve) => setTimeout(() => resolve("Fast!"), 100));
    const slow = new Promise((resolve) => setTimeout(() => resolve("Slow!"), 500));
    return Promise.race([fast, slow]).then((winner) => console.log("Winner:", winner));
}

// ---------- Task 11.4: async/await ----------
// The callback hell example rewritten with async/await
async function getDataWithAsync() {
    const user = await getUserData(1);
    console.log("User:", user);
    const posts = await getUserPosts(user.id);
    console.log("Posts:", posts);
    const comments = await getPostComments(posts[0].id);
    console.log("Comments:", comments);
    return comments;
}

async function fetchUserData(userId) {
    try {
        const user = await getUserData(userId);
        const posts = await getUserPosts(user.id);
        return { user, posts };
    } catch (error) {
        console.error("Failed to fetch:", error);
        throw error;
    }
}

async function getAllUsers() {
    // Parallel: about 1 second instead of 3
    const [u1, u2, u3] = await Promise.all([
        getUserData(1),
        getUserData(2),
        getUserData(3)
    ]);
    return [u1, u2, u3];
}

// ---------- Run everything in order ----------
async function main() {
    await new Promise((r) => setTimeout(r, 300)); // let A..E finish printing

    console.log("\n--- loadUser (callback) ---");
    await new Promise((resolve) => loadUser(1, (user) => { console.log("Data received:", user); resolve(); }));

    console.log("\n--- promise chain ---");
    await chainExample();

    console.log("\n--- Promise.all ---");
    await fetchThreeUsers();

    console.log("\n--- Promise.race ---");
    await raceExample();

    console.log("\n--- async/await ---");
    await getDataWithAsync();

    console.log("\n--- error handling ---");
    try {
        await fetchUserData(-1);
    } catch (error) {
        console.log("Caught:", error);
    }

    console.log("\n--- parallel ---");
    console.log(await getAllUsers());
}

main();
