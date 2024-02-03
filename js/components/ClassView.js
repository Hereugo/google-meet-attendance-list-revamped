class ClassView extends Modal {
    constructor() {
        super("gmal__class");
    }

    injectTemplate() {
        // TODO: Implement new html for creating a class
        document.body.insertAdjacentHTML('beforebegin', `
        <template id="gmal__class">
            <div id="gmal__class_modal" class="modal__background">
                <div id="popup" class="gmal__class_popup">
                    <div id="popup__header">
                        <h2 id="popup__title">New Class</h2>
                        <button id="popup__close">
                            <i class="fal fa-lg fa-times"></i>
                        </button>
                    </div>
                    <div id="popup__content">
                        <ul id="gmal__class_content">
                            <li>
                                <input type="text" id="gmal__class_name" name="className" placeholder="Class Name"/>
                            </li>
                            <li>
                                <tag-container id="tag_container" name="tags"></tag-container>
                                <button id="add_all_students" type="button">
                                    <i class="fal fa-lg fa-plus"></i>
                                    <span>Add All Current Students</span>
                                </button>
                            </li>
                            <li style="display: flex; justify-content: flex-end; gap: 12px;">
                                <button id="cancel">
                                    <span>Cancel</span>
                                </button>
                                <button id="submit" type="submit">
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
        
        // TODO: Add all Current Students to class
        document.getElementById("add_all_students").addEventListener("click", (e) => {
            console.log("Adding all current students to class...");
        });

        document.getElementById("cancel").addEventListener("click", (e) => this.close());
        document.getElementById("submit").addEventListener("click", (e) => {
            // TODO: Implement new class
            console.log("Creating new class...");

            this.close();
        });
    }

    connectedCallback() {
        if (!document.getElementById("gmal__class")) {
            this.injectTemplate();
        }

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
