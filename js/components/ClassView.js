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
                    </div>
                </div>
            </div>
        </template>
        `);
    }

    open() {
        super.open();

        // TODO: Implement new class
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
