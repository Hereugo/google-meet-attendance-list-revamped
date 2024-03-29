class DetailView extends Modal {
    constructor() {
        super("gmal__detail");

        this.classId = null;
    }

    injectTemplate() {
        // Custom html if empty class
        document.body.insertAdjacentHTML('beforebegin', `
        <template id="gmal__detail">
            <div id="gmal__detail_modal" class="modal__background">
                <div id="popup" class="gmal__detail_popup">
                    <div id="popup__header">
                        <h2 id="popup__title">Class Details</h2>
                        <button id="popup__close" title="Close">
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
                                <span style="flex: 2;">Joined At</span>
                                <span style="flex: 1;">Present</span>
                            </div>
                        </div>
                        <ul id="gmal__detail_content">
                        </ul>
                        <div id="gmal__detail_footer">
                            <button id="gmal__export">
                                <i class="fal fa-lg fa-file-download"></i>
                                <span>Export as CSV</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        `);
    }

    open() {
        chrome.storage.sync.get(["classes"]).then((result) => {
            let participants = JSON.parse(sessionStorage.getItem("participants")) || [];
            let classes = result.classes;
            super.open(classes[this.classId].name);
   
            let students = classes[this.classId].students.map((studentName) => {
                return participants.find((participant) => participant.name === studentName) || {
                    avatar: chrome.runtime.getURL("images/defaultAvatar.png"),
                    name: studentName,
                    joinedAt: -1,
                };
            });

            
            document.querySelector("#gmal__detail_search > input").addEventListener("keyup", (e) => {
                let value = e.target.value;
                
                for (let i = 0; i < students.length; i++) {
                    const item = document.querySelector(`.gmal__detail_item[data-index="${i}"]`);
                    const pattern = new RegExp(value, "gi");

                    item.dataset.gmal_hidden = !(pattern.test(students[i].name));
                }
            });

            for (let i = 0; i < students.length; i++) {
                const student = students[i];
                let isPresent = participants.some((participant) => participant.name === student.name);

                const item = Utils.addChild(
                    document.getElementById("gmal__detail_content"),
                    "li",
                    null,
                    "gmal__detail_item",
                    null,
                    {"data-present": isPresent, "data-index": i}
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

                let timeDisplay = (student.joinedAt != -1) ? new Date(student.joinedAt).toLocaleTimeString() : "--:--:--";
                Utils.addChild(row, "span", null, null, timeDisplay, {"style": "flex: 2;"});
  
                Utils.addChild(row, "i", null, `fal fa-lg ${isPresent ? "fa-check" : "fa-times"}`, null, {"style": "flex: 1;"});
            }

            document.getElementById("gmal__export").addEventListener("click", (_e) => {
                console.log("Exporting class");
            
                let csvArr = Utils.arrayToCSV([
                    ["Names", "Joined At", "Was Present?"],
                    ...students
                    // .filter((student, index) => !(document.querySelector(`.gmal__detail_item[data-index="${index}"]`).dataset.gmal_hidden || false))
                    .map((student) => [
                        student.name,
                        (student.joinedAt != -1) ? new Date(student.joinedAt).toLocaleString() : "--:--:--",
                        participants.some((participant) => participant.name === student.name)
                    ])
                ]);

                console.log(csvArr);

                Utils.downloadBlob(
                    csvArr,
                    `${classes[this.classId].name}_${new Date(Date.now()).toLocaleString()}`,
                    'text/csv;charset=utf-8;'
                )
            });
        });
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
