class ListView extends Modal {
    constructor() {
        super("gmal__list");
    }

    injectTemplate() {
        document.body.insertAdjacentHTML('beforebegin', `
        <template id="gmal__list">
            <div id="modal__background">
                <div id="popup" class="gmal__list_popup">
                    <div id="popup__header">
                        <h2 id="popup__title">Available Classes</h2>
                        <button id="popup__close">
                            <i class="fal fa-lg fa-times"></i>
                        </button>
                    </div>
                    <div id="popup__content">
                        <div class="gmal__list_search">
                            <input type="text" placeholder="Search for a class" />
                        </div>
                        <ul id="gmal__list_content">
                        </ul>
                    </div>
                </div>
            </div>
        </template>
        `);
    }

    open() {
        super.open();

        // TODO Fill in the popup content
        chrome.storage.sync.get(["classes"]).then((result) => {
            let participants = JSON.parse(sessionStorage.getItem("participants"));
            // let classes = result.classes;

            let classes = [
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

            for (let i = 0; i < classes.length; i++) {
                const item = Utils.addChild(
                    document.getElementById("gmal__list_content"),
                    "li",
                    null,
                    "gmal__list_item",
                );
    
                const link = Utils.addChild(item, "gmal-detail");
    
                Utils.addChild(link, "span", null, "gmal__list_item_title", classes[i].name);

                const classDetails = Utils.addChild(link, "div", null, "gmal__list_item_details");
    
                const classProfiles = Utils.addChild(classDetails, "div", null, "gmal__list_item_profiles");

                const present = participants.filter((participant) => {
                    return classes[i].students.includes(participant.name); // TODO: make lower case and remove spaces from names, and then compare
                });
        
                if (present.length <= 3) {
                    for (let j = 0; j < present.length; j++) {
                        Utils.addChild(
                            classProfiles,
                            "img",
                            null, null, null,
                            {src: present[j].avatar, alt: present[j].name}
                        );
                    }
                } else {
                    for (let j = 0; j < 2; j++) {
                        Utils.addChild(
                            classProfiles,
                            "img",
                            null, null, null,
                            {src: present[j].avatar, alt: present[j].name}
                        );
                    }
    
                    const classProfileMore = Utils.addChild(classProfiles, "div", null, "gmal__list_item_profile_more");
                    Utils.addChild(classProfileMore, "span", null, null, `+${present.length - 2}`);
                }
                Utils.addChild(classDetails, "span", null, "footnote", `${present.length} out of ${classes[i].students.length} present`);

                const classActions = Utils.addChild(link, "div", null, "gmal__list_item_actions");
                
                const editButton = Utils.addChild(classActions, "button", null, "gmal__list_item_action", null, {type: "button"});
                Utils.addChild(editButton, "i", null, "far fa-edit");

                editButton.addEventListener("click", (e) => {
                    console.log("Edit class: ", classes[i]);
                });

                const deleteButton = Utils.addChild(classActions, "button", null, "gmal__list_item_action", null, {type: "button"});
                Utils.addChild(deleteButton, "i", null, "far fa-trash");

                deleteButton.addEventListener("click", (e) => {
                    console.log("Delete class: ", classes[i]);
                });
            }
        });
    }

    connectedCallback() {
        this.injectTemplate();

        const btn = Utils.createElement("button", null, null, "List View");
        this.appendChild(btn);

        btn.addEventListener("click", (e) => {
            if (this.isOpen) {
                this.close();
            } else {
                this.open();
            }
            e.stopPropagation();
        });
    }
}

window.customElements.define("gmal-list", ListView);