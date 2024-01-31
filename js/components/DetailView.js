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
                <div id="popup" class="gmal__detail_popup">
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
                                <span style="flex: 3;">Name</span>
                                <span style="flex: 1;">Present</span>
                                <span style="flex: 2;">Joined At</span>
                                <span style="flex: 2;">
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
            super.open(classes[this.classId].name);
    
            let students = classes[this.classId].students.map((studentName) => {
                return participants.find((participant) => participant.name === studentName) || {
                    avatar: "",
                    name: studentName
                };
            });

            console.log(students);

            for (let i = 0; i < students.length; i++) {
                const student = students[i];
                let isPresent = participants.some((participant) => participant.name === student.name);

                const item = Utils.addChild(
                    document.getElementById("gmal__detail_content"),
                    "li",
                    null,
                    "gmal__detail_item",
                    null,
                    {"data-present": isPresent}
                );

                const row = Utils.addChild(item, "div", null, "gmal__detail_item_row");
                
                const userContent = Utils.addChild(row, "div", null, "gmal__detail_item_user", null, {"style": "flex: 3;"});
                Utils.addChild(
                    userContent,
                    "img",
                    null, "gmal__detail_item_avatar", null,
                    {src: student.avatar, alt: student.name || "avatar"},
                );
                Utils.addChild(
                    userContent,
                    "span",
                    null, "gmal__detail_item_name", student.name || "No name",
                );

                Utils.addChild(row, "i", null, `fal fa-lg ${isPresent ? "fa-check" : "fa-times"}`, null, {"style": "flex: 1;"});

                Utils.addChild(row, "span", null, null, "12:00:00 PM", {"style": "flex: 2;"});
                Utils.addChild(row, "span", null, null, "14:00:00 PM", {"style": "flex: 2;"});
            }
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
