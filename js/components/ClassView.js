class ClassView extends Modal {
    constructor() {
        super("gmal__class");
    }

    injectTemplate() {
        document.body.insertAdjacentHTML('beforebegin', `
        <template id="gmal__class">
            <div id="gmal__class_modal" class="modal__background">
                <div id="popup" class="gmal__class_popup">
                    <div id="popup__header">
                        <h2 id="popup__title">New Class</h2>
                        <button id="popup__close" title="Close">
                            <i class="fal fa-lg fa-times"></i>
                        </button>
                    </div>
                    <div id="popup__content">
                        <ul id="gmal__class_content">
                            <li>
                                <input type="text" id="gmal__class_name" name="className" placeholder="Class Name"/>
                            </li>
                            <li>
                                <tag-container id="gmal__tag_container" name="tags"></tag-container>
                                <button id="gmal__add_all_students" type="button">
                                    <i class="fal fa-lg fa-plus"></i>
                                    <span>Add All Current Students</span>
                                </button>
                            </li>
                            <li style="display: flex; justify-content: flex-end; gap: 12px;">
                                <button id="gmal__cancel" title="Cancel">
                                    <span>Cancel</span>
                                </button>
                                <button id="gmal__submit" type="submit" title="Create New Class">
                                    <span>Create</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </template>
        `);
    }

    open() {
        super.open();

        // Import data from class (if exists)
        chrome.storage.sync.get(["classes"]).then((result) => {
            let classRes = result.classes[this.classId] || {name: "", students: []};    
            document.getElementById("gmal__class_name").value = classRes.name;
            document.getElementById("gmal__tag_container").addTags(classRes.students);
        });

        document.getElementById("gmal__add_all_students").addEventListener("click", (_e) => {
            let participants = JSON.parse(sessionStorage.getItem("participants")) || [];
            
            document.getElementById("gmal__tag_container").addTags(participants.map(participant => participant.name));
        });

        document.getElementById("gmal__cancel").addEventListener("click", (_e) => this.close());
        document.getElementById("gmal__submit").addEventListener("click", (_e) => {
            let students = document.getElementById("gmal__tag_container").tags || [];
            let name = document.getElementById("gmal__class_name").value || "";

            chrome.storage.sync.get(["classes"]).then((result) => {
                let newClasses = result.classes || [];
                let newClass = { name, students };

                if (this.classId) {
                    newClasses[this.classId] = newClass;
                } else {
                    newClasses.push(newClass);
                }

                chrome.storage.sync.set({ classes: newClasses });
            });

            this.close();
        });
    }

    connectedCallback() {
        if (!document.getElementById("gmal__class")) {
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

window.customElements.define("gmal-class", ClassView);
