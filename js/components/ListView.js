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

        chrome.storage.sync.get(["classes"]).then((result) => {
            let participants = JSON.parse(sessionStorage.getItem("participants")) || [];
            let classes = result.classes;

            document.querySelector("#gmal__list_search > input").addEventListener("keyup", (e) => {
                let value = e.target.value;
                
                for (let i = 0; i < classes.length; i++) {
                    const item = document.querySelector(`.gmal__list_item[data-index="${i}"]`);
                    const pattern = new RegExp(value, "gi");

                    item.dataset.gmal_hidden = !(pattern.test(classes[i].name));
                }
            });

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
        this.insertAdjacentHTML('afterbegin', `
            <div id="gmal__list_button" class="r6xAKc">
                <span data-is-tooltip-wrapper="true">
                    <button class="VfPpkd-Bz112c-LgbsSe yHy1rc eT1oJ JsuyRc boDUxc" jsaction="click:cOuCgd; mousedown:UX7yZ; mouseup:lbsD7e; mouseenter:tfO1Yc; mouseleave:JywGue; touchstart:p6p2H; touchmove:FwuNnf; touchend:yfqBxc; touchcancel:JMtRjd; focus:AHmuwe; blur:O22p3e; contextmenu:mg9Pef;mlnRJb:fLiPzd" jsname="A5il2e" data-disable-idom="true" aria-label="Информация о встрече" data-tooltip-enabled="true" data-tooltip-id="tt-c10" aria-pressed="false" style="--mdc-ripple-fg-size:28px; --mdc-ripple-fg-scale:1.71429; --mdc-ripple-left:10px; --mdc-ripple-top:10px;">
                        <div jsname="s3Eaab" class="VfPpkd-Bz112c-Jh9lGc"></div>
                        <div class="VfPpkd-Bz112c-J1Ukfc-LhBDec"></div>
                        <i class="google-material-icons VfPpkd-kBDsod NtU4hc" aria-hidden="true">history_edu</i>
                        <i class="google-material-icons VfPpkd-kBDsod Mwv9k" aria-hidden="true">history_edu</i>
                    </button>
                    <div class="EY8ABd-OWXEXe-TAWMXe" role="tooltip" aria-hidden="true" id="tt-c10"></div>
                </span>
            </div>
        `);

        document.getElementById("gmal__list_button").addEventListener("click", (e) => {
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
