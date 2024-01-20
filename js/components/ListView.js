class ListView extends Modal {
    constructor() {
        super("gmal__list");
    }

    injectTemplate() {
        document.body.insertAdjacentHTML('beforebegin', `
        <template id="gmal__list">
            <div id="modal__background">
                <div id="popup">
                    <button id="popup__close"><svg-icon name="close-big"></svg-icon></button>
                    <div id="popup__content">
                        <p>List view</p>
                    </div>
                </div>
            </div>
        </template>
        `);   
    }

    open() {
        super.open();

        // TODO Fill in the popup content
        // document.getElementById("popup__content");
        // chrome.storage.sync.get(["classes"]).then((result) => {
        //     let participants = JSON.parse(sessionStorage.getItem("participants"));
        //     let classes = result.classes;
            
        //     let html = ``;

        //     // modify html and append to popup__content
        //     document.getElementById("popup__content").insertAdjacentHTML("beforeend", html);
        // });
        // console.log("Open list view: ", participants);
    }

    connectedCallback() {
        // this.injectTemplate();

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