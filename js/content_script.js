var classes = [ 
    {
        name: "Physics",
        students: [
            "Amir Nurmukhambetov",
            "Abraham Lincoln",
            "Abraham Lincoln",
        ],
    },
    {
        name: "Chemistry",
        students: [
            "Amir Nurmukhambetov",
            "Abraham Lincoln",
        ]
    },
    {
        name: "Biology",
        students: []
    }
];
 
// Entry point
(async () => {
    Utils.onReady(
        ".crqnQb",
        ".c8mVDd",
        initialize,
    );
})();

function initialize() {
    if (document.querySelector("#gmal__app")) {
        return;
    }

    if (Utils.storageAvailable("sessionStorage")) {
        populateStorage();
    } else {
        alert("Session storage is not available");
        // TODO Figure out another way to handle storage
    }

    ["js/utils.js", "js/inject.js"].forEach((filePath) => {
        let s = document.createElement("script");
        s.src = chrome.runtime.getURL(filePath);
        document.documentElement.appendChild(s);
    });

    setupDOM();
}

function populateStorage() {
    sessionStorage.setItem("participants", "[]");
}

window.addEventListener("message", (event) => {
    if (event.origin !== "https://meet.google.com") {
        return;
    }

    switch(event.data.sender) {
        case "inject-message": {
            let oldParticipants = JSON.parse(sessionStorage.getItem("participants")) || [];

            let newParticipants = event.data.participants.map((participant) => {
                let oldParticipant = oldParticipants.find((oldParticipant) => oldParticipant.name === participant.name);

                if (oldParticipant) {
                    participant.joinedAt = Math.min(participant.joinedAt, oldParticipant.joinedAt);
                }

                if (participant.avatar == "") {
                    participant.avatar = chrome.getURL("images/defaultAvatar.png");
                }
         
                return participant;
            });

            console.log(newParticipants);

            sessionStorage.setItem(
                "participants",
                JSON.stringify(newParticipants)
            );
        }
    }
});
