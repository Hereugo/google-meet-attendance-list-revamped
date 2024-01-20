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
                        <ul class="gmal__list_content">
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
            let classes = result.classes;
            
            let listItem = `
            <li class="gmal__list_item">
                <gmal-detail>
                    <span class="gmal__list_item_title">Physics</span>
                    <div class="gmal__list_item_details">
                        <div class="gmal__list_item_profiles">
                            <img src="https://picsum.photos/32/32" alt="random image" />
                            <img src="https://picsum.photos/32/32" alt="random image" />
                            <div class="gmal__list_item_profile_more">
                                <span>+3</span>
                            </div>
                        </div>
                        <span class="footnote">5 out of 10 present</span>
                    </div>
                    <div class="gmal__list_item_actions">
                        <button class="gmal__list_item_action">
                            <i class="far fa-edit"></i>
                        </button>
                        <button class="gmal__list_item_action">
                            <i class="far fa-trash"></i>
                        </button>
                    </div>
                </gmal-detail>
            </li>
            `;

            // modify html and append to popup__content
            document.getElementById("gmal__list_content").insertAdjacentHTML("beforeend", html);
        });
        console.log("Open list view: ", participants);
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