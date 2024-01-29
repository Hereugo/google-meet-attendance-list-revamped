class DetailView extends Modal {
    constructor() {
        super("gmal__detail");

        this.classId = null;
    }

    injectTemplate() {
        // TODO: Add buttons for exporting the list of participants
        // Custom html if empty class
        document.body.insertAdjacentHTML('beforebegin', `
        <template id="gmal__detail">
            <div id="gmal__detail_modal" class="modal__background">
                <div id="popup" class="gmal__list_popup">
                    <div id="popup__header">
                        <h2 id="popup__title">Class Details</h2>
                        <button id="popup__close">
                            <i class="fal fa-lg fa-times"></i>
                        </button>
                    </div>
                    <div id="popup__content">
                        <div id="gmal__detail_header">
                            <div id="gmal__detail_search">
                                <input type="text" placeholder="Filter by name" />
                            </div>
                            <div id="gmal__detail_header_title">
                                <span>Name</span>
                                <span>Present</span>
                                <span>Joined At</span>
                                <span>
                                    Duration <br/>
                                    <sub>(HH:MM:SS)</sub>
                                </span>
                            </div>
                        </div>
                        <ul id="gmal__detail_content">
                        </ul>
                    </div>
                </div>
            </div>
        </template>
        `);
    }

    open() {
        // TODO: Filter functionality by name
        
        // chrome.storage.sync.get(["classes"]).then((result) => {
        ((result) => {
            let participants = JSON.parse(sessionStorage.getItem("participants")) || [];
            // let classes = result.classes;
            
        
            console.log(classes[this.classId]);

            super.open(classes[this.classId].name);
    
            // TODO: Populate the list with participants of the class by this html template
            let html = `
            <li class="gmal__detail_item">
                <div class="gmal__detail_item_row">
                    <div class="gmal__detail_item_user">
                        <img class="gmal__detail_item_avatar" src="https://picsum.photos/32/32" alt="random image" />
                        <span class="gmal__detail_item__name">John Doe</span>
                    </div>
                    <i class="fal fa-lg fa-check"></i>
                    <span>02:00 PM</span>
                    <span>01:12:34</span>
                </div>
            </li>`;
        })();
    }

    connectedCallback() {
        if (!document.getElementById("gmal__detail")) {
            this.injectTemplate();
        }

        this.classId = this.dataset.index || null;

        this.addEventListener("click", (e) => {
            if (this.isOpen) {
                this.close();
            } else {
                this.open();
            }
            e.stopPropagation();
        });
    }
}

window.customElements.define("gmal-detail", DetailView);