class ListView extends Modal {
    constructor() {
        super("gmal__list");
    }

    injectTemplate() {
        // TODO: Add custom html if empty class
        document.body.insertAdjacentHTML('beforebegin', `
        <template id="gmal__list">
            <div id="gmal__list_modal" class="modal__background">
                <div id="popup" class="gmal__list_popup">
                    <div id="popup__header">
                        <h2 id="popup__title">Available Classes</h2>
                        <button id="popup__close">
                            <i class="fal fa-lg fa-times"></i>
                        </button>
                    </div>
                    <div id="popup__content">
                        <div id="gmal__list_header">
                            <div id="gmal__list_search">
                                <input type="text" placeholder="Search for a class" />
                            </div>
                            <div id="gmal__list_global_actions">
                                <gmal-class id="gmal__list_add_class">
                                    <i class="fal fa-lg fa-plus"></i>
                                </gmal-class>
                            </div>
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

        // On pressing new class, close previous modal.
        document.getElementById("gmal__list_add_class").addEventListener("click", () => this.close());

        // TODO: Search functionality by name

        chrome.storage.sync.get(["classes"]).then((result) => {
        // ((result) => {
            let participants = JSON.parse(sessionStorage.getItem("participants")) || [];
            let classes = result.classes;

            for (let i = 0; i < classes.length; i++) {
                const item = Utils.addChild(
                    document.getElementById("gmal__list_content"),
                    "li",
                    null,
                    "gmal__list_item",
                    null,
                    {"data-index": i}
                );
    
                const link = Utils.addChild(item, "gmal-detail", null, null, null, {"data-index": i});
                link.addEventListener("click", (_e) => this.close());

                Utils.addChild(link, "span", null, "gmal__list_item_title", classes[i].name);

                const classDetails = Utils.addChild(link, "div", null, "gmal__list_item_details");
    
                const classProfiles = Utils.addChild(classDetails, "div", null, "gmal__list_item_profiles");

                let present = classes[i].students.map((studentName) => {
                    return participants.find((participant) => participant.name === studentName) || {
                        avatar: chrome.runtime.getURL("images/defaultAvatar.png"),
                        name: studentName,
                        joinedAt: -1,
                    };
                }).filter((student) => student.joinedAt != -1);

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

                const classActions = Utils.addChild(link, "div", null, "gmal__list_action_popup");

                const classActionsButton = Utils.addChild(classActions, "label", null, "gmal__list_action_popup_button");
                Utils.addChild(classActionsButton, "i", null, "far fa-ellipsis-h");
                Utils.addChild(classActionsButton, "input", null, null, null, {"type": "checkbox", "style": "display: none;"});
                classActionsButton.addEventListener("click", (e) => e.stopPropagation()); // Prevents detail view from opening

                const classActionsContent = Utils.addChild(classActions, "ul", null, "gmal__list_action_popup_content");

                const viewButtonItem = Utils.addChild(classActionsContent, "li", null, "gmal__list_action_popup_item");
                const viewButton = Utils.addChild(viewButtonItem, "gmal-detail", null, null, "View", {"data-index": i});
                viewButton.addEventListener("click", (_e) => this.close());
  
                const editButtonItem = Utils.addChild(classActionsContent, "li", null, "gmal__list_action_popup_item");
                const editButton = Utils.addChild(editButtonItem, "gmal-class", null, null, "Edit", {"data-index": i});
                editButton.addEventListener("click", (_e) => this.close());
    
                const deleteButtonItem = Utils.addChild(classActionsContent, "li", null, "gmal__list_action_popup_item");
                const deleteButton = Utils.addChild(deleteButtonItem, "button", null, null, "Delete");
                deleteButton.addEventListener("click", (e) => {
                    chrome.storage.sync.get(["classes"]).then((result) => {
                        let newClasses = result.classes || [];

                        newClasses = [...newClasses.slice(0, i), ...newClasses.slice(i + 1)];

                        chrome.storage.sync.set({classes: newClasses});
                    });
                    
                    document.getElementById("gmal__list_content").removeChild(item);
                    
                    e.stopPropagation();
                });
            }
        });
    }

    connectedCallback() {
        if (!document.getElementById("gmal__list")) {
            this.injectTemplate();
        }

        // TODO: Instead of regular button, make it look better.
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
